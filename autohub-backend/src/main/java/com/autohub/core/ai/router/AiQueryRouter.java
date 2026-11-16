package com.autohub.core.ai.router;

import com.autohub.core.ai.dto.AiRouteDecision;
import com.autohub.core.ai.dto.AiRouteDecision.AiIntent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Slf4j
@Service
public class AiQueryRouter {

    private final ChatClient plainChatClient;

    public AiQueryRouter(@Qualifier("plainChatClient") ChatClient plainChatClient) {
        this.plainChatClient = plainChatClient;
    }

    private static final String ROUTER_SYSTEM_PROMPT = """
        <role>
        Bạn là Bộ định tuyến Ý định (Semantic Intent Router) của nền tảng xe điện AutoHub.
        Nhiệm vụ: Phân tích câu hỏi người dùng, phân loại đúng 1 AiIntent và trích xuất tham số ra JSON chuẩn theo schema AiRouteDecision.
        </role>

        <priority_rules>
        Nếu câu hỏi chứa nhiều từ khóa, ưu tiên phân loại theo thứ tự từ trên xuống dưới:
        1. ROLLOUT_FEE_CALCULATION: Hỏi chi phí lăn bánh, thuế trước bạ, phí biển số, tổng tiền ra biển tại tỉnh/thành.
           - Trích xuất `province` và BẮT BUỘC chuẩn hóa tên tỉnh: "SG", "Sài Gòn", "TPHCM", "TP.HCM" -> "Hồ Chí Minh"; "HN" -> "Hà Nội"; "ĐN" -> "Đà Nẵng". Nếu không nhắc tới tỉnh nào, mặc định "Hà Nội".
           - Trích xuất tên xe vào `carKeyword` nếu có.
        2. INVENTORY_SHOWROOM_CHECK: Hỏi tồn kho, xe có sẵn giao ngay, xe lái thử, địa chỉ/tình trạng xe tại showroom.
           - Trích xuất tên xe vào `carKeyword` và tên showroom/quận vào `location` (nếu có).
        3. DEPOSIT_POLICY_72H: Hỏi quy chế đặt cọc giữ xe 72h, hoàn tiền 100%, chính sách bảo chứng cọc.
        4. BATTERY_WARRANTY_POLICY: Hỏi về pin xe điện, bảo hành pin, công nghệ sạc 800V SiC, tuổi thọ pin, chai pin, thuê/đổi pin.
        5. ACCESSORY_COMPATIBILITY: Tìm phụ kiện, bộ sạc tại nhà (Wallbox), trạm sạc, thảm sàn, camera hành trình, dán phim cách nhiệt.
        6. CAR_CONSULTATION: Hỏi thông tin dòng xe, so sánh xe, thông số kỹ thuật, giá niêm yết, tìm xe theo ngân sách, số chỗ ngồi, hoặc xếp hạng xe.
           - `sortOrder` = "PRICE_DESC" nếu có: "đắt nhất", "mắc nhất", "cao nhất", "sang nhất", "vip nhất".
           - `sortOrder` = "PRICE_ASC" nếu có: "rẻ nhất", "thấp nhất", "kinh tế nhất", "tiết kiệm nhất", "giá rẻ".
           - `sortOrder` = "ACCELERATION_ASC" nếu có: "nhanh nhất", "tăng tốc tốt nhất", "mạnh nhất".
           - Mặc định `sortOrder` = "DEFAULT".
        7. GENERAL_GREETING: CHỈ KHI câu hỏi thuần túy là lời chào ("chào", "hello", "hi", "xin chào", "shop ơi") và KHÔNG chứa bất kỳ từ khóa nào về xe, giá, pin, phụ kiện hay chính sách.
        8. GENERAL_CONVERSATION: Các câu hỏi ngoài lề, trò chuyện phiếm, hỏi về danh tính AI hoặc các câu hỏi can thiệp hệ thống ("xóa csdl", "hack", "bạn là ai").
        </priority_rules>

        <examples>
        User: "Chào shop, cho mình hỏi xe nào rẻ nhất bên mình vậy?"
        Output: {"intent": "CAR_CONSULTATION", "sortOrder": "PRICE_ASC", "province": null, "carKeyword": null}

        User: "Tính giúp mình giá lăn bánh VF 8 ở Sài Gòn"
        Output: {"intent": "ROLLOUT_FEE_CALCULATION", "sortOrder": "DEFAULT", "province": "Hồ Chí Minh", "carKeyword": "VF 8"}

        User: "Showroom Quận 7 còn sẵn xe giao ngay không?"
        Output: {"intent": "INVENTORY_SHOWROOM_CHECK", "sortOrder": "DEFAULT", "province": null, "carKeyword": null}

        User: "Xin chào"
        Output: {"intent": "GENERAL_GREETING", "sortOrder": "DEFAULT", "province": null, "carKeyword": null}
        </examples>

        BẮT BUỘC chỉ trả về JSON hợp lệ khớp với schema AiRouteDecision, không giải thích thêm.
        """;

    public AiRouteDecision routeUserPrompt(String userPrompt) {
        String prompt = userPrompt != null ? userPrompt.trim() : "";
        if (prompt.isBlank()) {
            return fallbackHeuristicRouter("");
        }

        try {
            log.info("[AI Router] Phân tích ngữ nghĩa qua Spring AI Structured Output: {}", prompt);
            AiRouteDecision decision = plainChatClient.prompt()
                    .system(ROUTER_SYSTEM_PROMPT)
                    .user(prompt)
                    .call()
                    .entity(AiRouteDecision.class);

            if (decision != null && decision.intent() != null) {
                log.info("[AI Router] Phân loại thành công -> Intent: {}, sortOrder: {}, vehicle: {}, province: {}",
                        decision.intent(), decision.sortOrder(), decision.targetVehicleName(), decision.province());
                return decision;
            }
        } catch (Exception ex) {
            log.warn("[AI Router] Structured Output gặp sự cố [{}]: {}, chuyển sang Heuristic Router",
                    ex.getClass().getSimpleName(), ex.getMessage());
        }

        return fallbackHeuristicRouter(prompt);
    }

    public AiRouteDecision fallbackHeuristicRouter(String prompt) {
        String pLower = prompt.toLowerCase();

        // 1. Kiểm tra Câu hỏi Bảo Mật / Quyền hạn / Xóa CSDL / Trò chuyện chung
        if (pLower.contains("xóa") || pLower.contains("csdl") || pLower.contains("database") ||
                pLower.contains("hack") || pLower.contains("bạn là ai") || pLower.contains("ai tạo ra bạn") ||
                pLower.contains("bạn làm được gì")) {
            return new AiRouteDecision(
                    AiIntent.GENERAL_CONVERSATION,
                    null, null, null, null, null,
                    null, prompt, "DEFAULT", 0.99
            );
        }

        // 2. Kiểm tra Pin & Chính Sách Bảo Hành Pin Xe Điện 800V
        if (pLower.contains("bảo hành pin") || pLower.contains("bảo hành") || pLower.contains("chai pin") ||
                pLower.contains("tuổi thọ pin") || pLower.contains("pin xe điện") || pLower.contains("800v") ||
                pLower.contains("sic")) {
            return new AiRouteDecision(
                    AiIntent.BATTERY_WARRANTY_POLICY,
                    null, "ELECTRIC", null, null, null,
                    null, prompt, "DEFAULT", 0.98
            );
        }

        // 3. Kiểm tra Lăn Bánh / Thuế Trước Bạ
        if (pLower.contains("lăn bánh") || pLower.contains("thuế") || pLower.contains("chi phí") ||
                pLower.contains("trước bạ") || pLower.contains("ra biển") || pLower.contains("tổng tiền")) {
            String province = "Hà Nội";
            if (pLower.contains("hồ chí minh") || pLower.contains("tp.hcm") || pLower.contains("sài gòn") || pLower.contains("hcm")) {
                province = "Hồ Chí Minh";
            } else if (pLower.contains("đà nẵng")) {
                province = "Đà Nẵng";
            } else if (pLower.contains("hải phòng")) {
                province = "Hải Phòng";
            } else if (pLower.contains("cần thơ")) {
                province = "Cần Thơ";
            }
            String targetCar = extractVehicleName(pLower);
            return new AiRouteDecision(
                    AiIntent.ROLLOUT_FEE_CALCULATION,
                    targetCar, null, null, null, null,
                    province, prompt, "DEFAULT", 0.95
            );
        }

        // 4. Kiểm tra Tồn Kho / Showroom / Lái Thử
        if (pLower.contains("tồn kho") || pLower.contains("có sẵn") || pLower.contains("giao ngay") ||
                pLower.contains("kho") || pLower.contains("showroom") || pLower.contains("lái thử")) {
            String targetCar = extractVehicleName(pLower);
            return new AiRouteDecision(
                    AiIntent.INVENTORY_SHOWROOM_CHECK,
                    targetCar, null, null, null, null,
                    null, prompt, "DEFAULT", 0.95
            );
        }

        // 5. Kiểm tra Phụ Kiện / Trạm Sạc / Thảm / Camera
        if (pLower.contains("phụ kiện") || pLower.contains("sạc") || pLower.contains("thảm") ||
                pLower.contains("camera") || pLower.contains("dán phim") || pLower.contains("bơm lốp")) {
            return new AiRouteDecision(
                    AiIntent.ACCESSORY_COMPATIBILITY,
                    null, null, null, null, null,
                    null, prompt, "DEFAULT", 0.95
            );
        }

        // 6. Kiểm tra Chính Sách Cọc 72h / Hoàn Tiền
        if (pLower.contains("cọc") || pLower.contains("72h") || pLower.contains("hoàn tiền") ||
                pLower.contains("hoàn cọc") || pLower.contains("giữ chỗ") || pLower.contains("đặt cọc")) {
            return new AiRouteDecision(
                    AiIntent.DEPOSIT_POLICY_72H,
                    null, null, null, null, null,
                    null, prompt, "DEFAULT", 0.95
            );
        }

        // 7. Kiểm tra Giá Cao Nhất / Đắt Nhất
        boolean isMostExpensive = pLower.contains("đắt nhất") || pLower.contains("mắc nhất") ||
                pLower.contains("cao nhất") || pLower.contains("giá cao") || pLower.contains("sang nhất") ||
                pLower.contains("vip nhất");
        if (isMostExpensive) {
            return new AiRouteDecision(
                    AiIntent.CAR_CONSULTATION,
                    null, null, null, null, null,
                    null, prompt, "PRICE_DESC", 0.98
            );
        }

        // 8. Kiểm tra Giá Thấp Nhất / Rẻ Nhất
        boolean isCheapest = pLower.contains("rẻ nhất") || pLower.contains("thấp nhất") ||
                pLower.contains("giá thấp") || pLower.contains("kinh tế nhất") || pLower.contains("tiết kiệm nhất") ||
                pLower.contains("giá rẻ") || pLower.contains("xe rẻ") ||
                (pLower.contains("rẻ") && !pLower.contains("trẻ"));
        if (isCheapest) {
            return new AiRouteDecision(
                    AiIntent.CAR_CONSULTATION,
                    null, null, null, null, null,
                    null, prompt, "PRICE_ASC", 0.98
            );
        }

        // 9. Kiểm tra Tăng Tốc Nhanh Nhất
        if (pLower.contains("nhanh nhất") || pLower.contains("tăng tốc") || pLower.contains("mạnh nhất")) {
            return new AiRouteDecision(
                    AiIntent.CAR_CONSULTATION,
                    null, null, null, null, null,
                    null, prompt, "ACCELERATION_ASC", 0.95
            );
        }

        // 10. Kiểm tra Bảng Giá / Tìm Xe / Tra Cứu Danh Mục Xe
        boolean isCatalogQuery = pLower.contains("bảng giá") || pLower.contains("tìm xe") ||
                pLower.contains("giá xe") || pLower.contains("danh sách xe") || pLower.contains("các loại xe") ||
                pLower.contains("những xe") || pLower.contains("tất cả xe") || pLower.contains("xe nào") ||
                pLower.contains("có những xe") || pLower.contains("tư vấn xe") || pLower.contains("mua xe") ||
                pLower.contains("chọn xe");
        if (isCatalogQuery) {
            return new AiRouteDecision(
                    AiIntent.CAR_CONSULTATION,
                    extractVehicleName(pLower), null, null, null, null,
                    null, prompt, "DEFAULT", 0.95
            );
        }

        // 11. Chào Hỏi Thuần Túy (CẤM gán Greeting nếu có từ khóa về xe, giá, cọc, mua)
        boolean hasCarOrIntentKeywords = pLower.contains("xe") || pLower.contains("giá") || pLower.contains("tiền") ||
                pLower.contains("bảng") || pLower.contains("tìm") || pLower.contains("rẻ") || pLower.contains("đắt") ||
                pLower.contains("mua") || pLower.contains("cọc") || pLower.contains("lăn bánh") || pLower.contains("pin");

        boolean isGreeting = !hasCarOrIntentKeywords && (
                pLower.equals("chào") || pLower.equals("xin chào") || pLower.equals("hello") || pLower.equals("hi") ||
                pLower.equals("hey") || pLower.equals("alo") || pLower.startsWith("chào bạn") || pLower.startsWith("xin chào bạn")
        );
        if (isGreeting) {
            return new AiRouteDecision(
                    AiIntent.GENERAL_GREETING,
                    null, null, null, null, null,
                    null, prompt, "DEFAULT", 0.90
            );
        }

        // 11. Mặc định: Tư vấn xe với các thông số trích xuất
        String fuel = (pLower.contains("điện") || pLower.contains("ev") || pLower.contains("pin")) ? "ELECTRIC" : null;
        Integer seats = pLower.contains("7 chỗ") ? 7 : (pLower.contains("5 chỗ") ? 5 : null);
        String body = pLower.contains("suv") ? "SUV" : (pLower.contains("sedan") ? "SEDAN" : null);

        BigDecimal budget = null;
        if (pLower.contains("dưới 1 tỷ") || pLower.contains("1 tỷ")) {
            budget = new BigDecimal("1000000000");
        } else if (pLower.contains("2 tỷ")) {
            budget = new BigDecimal("2000000000");
        } else if (pLower.contains("3 tỷ")) {
            budget = new BigDecimal("3000000000");
        }

        return new AiRouteDecision(
                AiIntent.CAR_CONSULTATION,
                null, fuel, body, seats, budget,
                null, prompt, "DEFAULT", 0.85
        );
    }

    private String extractVehicleName(String pLower) {
        if (pLower.contains("vf8") || pLower.contains("vf 8")) return "VinFast VF8";
        if (pLower.contains("vf9") || pLower.contains("vf 9")) return "VinFast VF9";
        if (pLower.contains("santafe") || pLower.contains("santa fe")) return "Hyundai SantaFe";
        if (pLower.contains("everest")) return "Ford Everest";
        if (pLower.contains("track")) return "AutoHub GT-e Track Edition";
        if (pLower.contains("grand touring")) return "AutoHub GT-e Grand Touring";
        if (pLower.contains("standard")) return "AutoHub GT-e Standard";
        if (pLower.contains("sport tourer")) return "AutoHub GT-e Sport Tourer";
        if (pLower.contains("cross touring") || pLower.contains("suv-e")) return "AutoHub SUV-e Cross Touring";
        if (pLower.contains("executive")) return "AutoHub GT-e Executive";
        if (pLower.contains("touring")) return "AutoHub GT-e Grand Touring";
        return null;
    }
}
