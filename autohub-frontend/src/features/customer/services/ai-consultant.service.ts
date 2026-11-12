import { axiosClient } from '@/lib/axios';
import { API_CONFIG } from '@/config/api.config';
import type { ApiResponse } from '@/types/api.types';
import type { AiChatMessage, AiModelOption } from '@/types/ai.types';
import { INITIAL_AI_CHAT_MESSAGES } from '../mocks/ai-consultant.mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_MODELS: AiModelOption[] = [
  { id: 'liquid/lfm-3-1.7b:free', name: 'Liquid LFM 3 1.7B (Free)', provider: 'Liquid AI', isFree: true, active: true },
  { id: 'google/gemma-4-31b-it:free', name: 'Google Gemma 4 31B (Free)', provider: 'Google', isFree: true, active: false },
  { id: 'nvidia/nemotron-3.5-super-vl:free', name: 'NVIDIA Nemotron 3.5 (Free)', provider: 'NVIDIA', isFree: true, active: false },
  { id: 'google/gemini-2.0-flash-001', name: 'Google Gemini 2.0 Flash', provider: 'Google Cloud', isFree: false, active: false },
  { id: 'openai/gpt-4o-mini', name: 'OpenAI GPT-4o Mini', provider: 'OpenAI', isFree: false, active: false },
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3', provider: 'DeepSeek', isFree: false, active: false },
];

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

  getModels: async (): Promise<AiModelOption[]> => {
    if (USE_MOCK) {
      await delay(200);
      return [...MOCK_MODELS];
    }

    const response = await axiosClient.get<unknown, ApiResponse<AiModelOption[]>>(
      `${API_CONFIG.BASE_URL}/ai/models`
    );
    return response.data;
  },

  switchModel: async (modelId: string): Promise<AiModelOption> => {
    if (USE_MOCK) {
      await delay(200);
      const target = MOCK_MODELS.find((m) => m.id === modelId);
      MOCK_MODELS.forEach((m) => {
        m.active = m.id === modelId;
      });
      return target || MOCK_MODELS[0];
    }

    const response = await axiosClient.post<unknown, ApiResponse<AiModelOption>>(
      `${API_CONFIG.BASE_URL}/ai/models/switch`,
      { modelId }
    );
    return response.data;
  },

  sendMessage: async (userPrompt: string, model?: string): Promise<AiChatMessage> => {
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
          senderTitle: 'AutoHub AI (OpenRouter)',
          timestamp,
          content: '',
          currentModel: model || 'liquid/lfm-3-1.7b:free',
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
        senderTitle: 'AutoHub AI (OpenRouter)',
        timestamp,
        content: `Cảm ơn quý khách đã hỏi: "${userPrompt}". Trợ lý AI AutoHub (kết nối trực tiếp qua OpenRouter AI Proxy) đã truy vấn thông số thời gian thực từ showroom và kho xe để cung cấp giải pháp tối ưu nhất cho quý khách. Quý khách có thể lựa chọn lái thử trực tiếp hoặc đặt cọc giữ chỗ 72 giờ qua cổng SePay ngay bên dưới.`,
        currentModel: model || 'liquid/lfm-3-1.7b:free',
        suggestedPrompts: [
          'Dự toán chi phí lăn bánh tại Hà Nội',
          'Tư vấn chính sách vay trả góp 80%',
          'Đăng ký lái thử xe trải nghiệm',
        ],
      };
    }

    const response = await axiosClient.post<unknown, ApiResponse<AiChatMessage>>(
      `${API_CONFIG.BASE_URL}/ai/chat`,
      { prompt: userPrompt, model }
    );
    return response.data;
  },
};
