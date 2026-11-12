import { useState, useEffect, useCallback } from 'react';
import type { AiChatMessage, AiModelOption } from '@/types/ai.types';
import { aiConsultantService } from '../services/ai-consultant.service';

export interface UseAiConsultantResult {
  messages: AiChatMessage[];
  models: AiModelOption[];
  selectedModel: string;
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  sendMessage: (promptText: string) => Promise<void>;
  changeModel: (modelId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useAiConsultant = (): UseAiConsultantResult => {
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [models, setModels] = useState<AiModelOption[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('liquid/lfm-3-1.7b:free');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistoryAndModels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [messagesData, modelsData] = await Promise.all([
        aiConsultantService.getInitialMessages(),
        aiConsultantService.getModels(),
      ]);
      setMessages(messagesData);
      setModels(modelsData);
      const activeOne = modelsData.find((m) => m.active);
      if (activeOne) {
        setSelectedModel(activeOne.id);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể kết nối đến Trợ lý ảo AI';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changeModel = useCallback(async (modelId: string) => {
    try {
      await aiConsultantService.switchModel(modelId);
      setSelectedModel(modelId);
      setModels((prev) =>
        prev.map((m) => ({
          ...m,
          active: m.id === modelId,
        }))
      );
    } catch (err: unknown) {
      console.error('Không thể chuyển đổi model:', err);
      setSelectedModel(modelId);
    }
  }, []);

  const sendMessage = useCallback(
    async (promptText: string) => {
      if (!promptText.trim()) return;

      const userTime = new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date());

      const userMsg: AiChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'USER',
        senderTitle: 'Quý khách (VIP Member)',
        timestamp: userTime,
        avatarText: 'VK',
        content: promptText,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsSending(true);

      try {
        const aiReply = await aiConsultantService.sendMessage(promptText, selectedModel);
        setMessages((prev) => [...prev, aiReply]);
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Lỗi khi gửi yêu cầu đến AI';
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: 'AI',
            senderTitle: 'AutoHub AI',
            timestamp: userTime,
            content: `Xin lỗi quý khách, hệ thống ghi nhận lỗi: ${errorMsg}. Vui lòng thử lại sau giây lát hoặc đổi Model OpenRouter khác.`,
          },
        ]);
      } finally {
        setIsSending(false);
      }
    },
    [selectedModel]
  );

  useEffect(() => {
    void fetchHistoryAndModels();
  }, [fetchHistoryAndModels]);

  return {
    messages,
    models,
    selectedModel,
    isLoading,
    isSending,
    error,
    sendMessage,
    changeModel,
    refetch: fetchHistoryAndModels,
  };
};
