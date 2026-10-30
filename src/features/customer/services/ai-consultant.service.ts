import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiResponse } from '@/types/api.types';
import type { AiChatMessage } from '@/types/ai.types';
import { INITIAL_AI_CHAT_MESSAGES } from '../mocks/ai-consultant.mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const aiConsultantService = {
  getInitialMessages: async (): Promise<AiChatMessage[]> => {
    if (USE_MOCK) {
      await delay(300);
      return [...INITIAL_AI_CHAT_MESSAGES];
    }

    const response = await axiosClient.get<unknown, ApiResponse<AiChatMessage[]>>(
      `${API_CONFIG.BASE_URL}/ai/conversation`
    );
    return response.data;
  },

  sendMessage: async (userPrompt: string): Promise<AiChatMessage> => {
    if (USE_MOCK) {
      await delay(800);

      const timestamp = new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date());

      // If user asks about comparison or track edition
      if (userPrompt.toLowerCase().includes('track edition') || userPrompt.toLowerCase().includes('so sánh')) {
        return {
          id: `msg-${Date.now()}`,
          sender: 'AI',
          senderTitle: 'AutoHub Gemini AI',
          timestamp,
          content: '',
          functionCall: {
            querySegment: 'So sánh cấu hình Track Edition vs Grand Touring',
            priceRange: '2.89 - 3.25 Tỷ VNĐ',
            matchPercentage: 96.5,
          },
          rationale:
            'Phiên bản AutoHub GT-e Track Edition được tinh chỉnh hiệu năng cao với gói pin 105 kWh, 2 mô-tơ điện sản sinh 750 HP, tăng tốc 0-100 km/h chỉ 2.6 giây cùng phanh gốm carbon cao cấp. Bản Grand Touring lại tối ưu về độ êm ái, cách âm đa lớp và khoảng cách di chuyển dài hơn (+60 km). Đối với nhu cầu gia đình, bản Grand Touring vẫn là sự lựa chọn tiện nghi vượt trội.',
          suggestedPrompts: [
            'Đặt cọc giữ xe 72h ngay',
            'Đăng ký lái thử bản Grand Touring',
            'Chi phí lăn bánh tại TP.HCM',
          ],
        };
      }

      // Default mock response
      return {
        id: `msg-${Date.now()}`,
        sender: 'AI',
        senderTitle: 'AutoHub Gemini AI',
        timestamp,
        content: `Cảm ơn quý khách đã hỏi: "${userPrompt}". Trợ lý AI AutoHub (sử dụng Gemini API kết hợp Vector Database RAG) đã truy vấn thông số thời gian thực từ showroom và kho xe để cung cấp giải pháp tối ưu nhất cho quý khách. Quý khách có thể lựa chọn lái thử trực tiếp hoặc đặt cọc giữ chỗ 72 giờ qua cổng SePay ngay bên dưới.`,
        suggestedPrompts: [
          'Dự toán chi phí lăn bánh tại Hà Nội',
          'Tư vấn chính sách vay trả góp 80%',
          'Đăng ký lái thử xe trải nghiệm',
        ],
      };
    }

    const response = await axiosClient.post<unknown, ApiResponse<AiChatMessage>>(
      `${API_CONFIG.BASE_URL}/ai/chat`,
      { prompt: userPrompt }
    );
    return response.data;
  },
};
