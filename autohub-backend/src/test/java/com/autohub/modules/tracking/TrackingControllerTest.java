package com.autohub.modules.tracking;

import com.autohub.core.enums.LoaiHanhViTracking;
import com.autohub.core.user.entity.NhatKyHanhVi;
import com.autohub.core.user.repository.NhatKyHanhViRepository;
import com.autohub.modules.tracking.dto.TrackingEventRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class TrackingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private NhatKyHanhViRepository nhatKyHanhViRepository;

    @Test
    @DisplayName("Verify POST /tracking/collect records CALCULATE_ESTIMATOR event successfully")
    void verifyCollectEstimatorEvent() throws Exception {
        String testSessionId = "test_sess_estimator_" + System.currentTimeMillis();
        TrackingEventRequest request = TrackingEventRequest.builder()
                .maPhien(testSessionId)
                .loaiHanhVi(LoaiHanhViTracking.CALCULATE_ESTIMATOR)
                .loaiThucThe("ESTIMATOR")
                .maThucThe(1L)
                .thoiGianDungXem(15)
                .duLieuBoSung("{\"cityName\":\"Hà Nội\",\"trimName\":\"Standard GT\",\"totalRolloutCost\":2700000000}")
                .build();

        MvcResult result = mockMvc.perform(post("/tracking/collect")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn();

        String jsonContent = result.getResponse().getContentAsString(StandardCharsets.UTF_8);
        JsonNode root = objectMapper.readTree(jsonContent);
        assertTrue(root.get("success").asBoolean());
        assertEquals("RECORDED", root.get("data").asText());

        // Verify in database
        List<NhatKyHanhVi> logs = nhatKyHanhViRepository.findByMaPhien(testSessionId);
        assertFalse(logs.isEmpty());
        NhatKyHanhVi log = logs.get(0);
        assertEquals(LoaiHanhViTracking.CALCULATE_ESTIMATOR, log.getLoaiHanhVi());
        assertEquals("ESTIMATOR", log.getLoaiThucThe());
        assertEquals(15, log.getThoiGianDungXem());
        assertTrue(log.getDuLieuBoSung().contains("Hà Nội"));
    }

    @Test
    @DisplayName("Verify POST /tracking/collect records INTERACT_360 and INITIATE_DEPOSIT events")
    void verifyCollectStudioAndDepositEvents() throws Exception {
        String testSessionId = "test_sess_studio_" + System.currentTimeMillis();

        // 1. Gửi sự kiện xoay 360 độ
        TrackingEventRequest req360 = TrackingEventRequest.builder()
                .maPhien(testSessionId)
                .loaiHanhVi(LoaiHanhViTracking.INTERACT_360)
                .loaiThucThe("CAR")
                .maThucThe(1L)
                .duLieuBoSung("{\"tabId\":\"exterior\",\"tabLabel\":\"Ngoại thất 360°\"}")
                .build();

        mockMvc.perform(post("/tracking/collect")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req360)))
                .andExpect(status().isOk());

        // 2. Gửi sự kiện bấm nút cọc xe 72h
        TrackingEventRequest reqDeposit = TrackingEventRequest.builder()
                .maPhien(testSessionId)
                .loaiHanhVi(LoaiHanhViTracking.INITIATE_DEPOSIT)
                .loaiThucThe("CAR")
                .maThucThe(1L)
                .duLieuBoSung("{\"carName\":\"AutoHub GT-e\",\"depositAmount\":20000000}")
                .build();

        mockMvc.perform(post("/tracking/collect")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reqDeposit)))
                .andExpect(status().isOk());

        // Kiểm tra CSDL
        List<NhatKyHanhVi> logs = nhatKyHanhViRepository.findByMaPhien(testSessionId);
        assertEquals(2, logs.size());
        assertTrue(logs.stream().anyMatch(l -> l.getLoaiHanhVi() == LoaiHanhViTracking.INTERACT_360));
        assertTrue(logs.stream().anyMatch(l -> l.getLoaiHanhVi() == LoaiHanhViTracking.INITIATE_DEPOSIT));
    }
}
