import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import { getSessionId } from '@/lib/tracker';
import type { ApiResponse } from '@/types/api.types';
import type { AiChatMessage, AiChatPayload } from '@/types/ai.types';
import { INITIAL_AI_CHAT_MESSAGES } from '../mocks/ai-consultant.mock';

// Mặc định kết nối Spring AI Backend thật (chỉ dùng mock khi cấu hình rõ VITE_USE_MOCK=true)
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const aiConsultantService = {
  getInitialMessages: async (): Promise<AiChatMessage[]> => {
    if (USE_MOCK) {
      await delay(300);
      return [...INITIAL_AI_CHAT_MESSAGES];
    }

    try {
      const response = await axiosClient.get<unknown, ApiResponse<AiChatMessage[]>>(
        '/ai/conversation'
      );
      if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch {
      // Fallback an toàn về tin nhắn chào khởi tạo nếu chưa có lịch sử hội thoại
    }

    return [...INITIAL_AI_CHAT_MESSAGES];
  },

  sendMessage: async (
    userPrompt: string,
    contextCarId?: number,
    contextCarName?: string
  ): Promise<AiChatMessage> => {
    if (USE_MOCK) {
      await delay(800);
      const timestamp = new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date());

      return {
        id: `msg-${Date.now()}`,
        sender: 'AI',
        senderTitle: 'AutoHub AI Consultant (Mock Mode)',
        timestamp,
        content: `[Mock] Phản hồi thử nghiệm cho câu hỏi: "${userPrompt}". Bạn có thể tắt VITE_USE_MOCK để trải nghiệm Spring AI ChatClient trực tiếp trên CSDL AutoHubDB.`,
        suggestedPrompts: [
          'Dự toán chi phí lăn bánh tại Hà Nội',
          'Kiểm tra tồn kho xe có sẵn tại Showroom',
          'Tư vấn chính sách vay ngân hàng 80%',
        ],
      };
    }

    const payload: AiChatPayload = {
      prompt: userPrompt,
      contextCarId,
      contextCarName,
      sessionId: getSessionId(),
    };

    const response = await axiosClient.post<unknown, ApiResponse<AiChatMessage>>(
      API_CONFIG.ENDPOINTS.AI_CONSULTANT.CHAT,
      payload
    );
    return response.data;
  },
};
