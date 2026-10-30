import { useState, useEffect, useCallback } from 'react';
import type { AiChatMessage } from '@/types/ai.types';
import { aiConsultantService } from '../services/ai-consultant.service';

export interface UseAiConsultantResult {
  messages: AiChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  sendMessage: (promptText: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useAiConsultant = (): UseAiConsultantResult => {
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await aiConsultantService.getInitialMessages();
      setMessages(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể kết nối đến Trợ lý ảo AI';
      setError(msg);
    } finally {
      setIsLoading(false);
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
        const aiReply = await aiConsultantService.sendMessage(promptText);
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
            content: `Xin lỗi quý khách, hệ thống ghi nhận lỗi: ${errorMsg}. Vui lòng thử lại sau giây lát.`,
          },
        ]);
      } finally {
        setIsSending(false);
      }
    },
    []
  );

  useEffect(() => {
    let isMounted = true;

    aiConsultantService
      .getInitialMessages()
      .then((data) => {
        if (isMounted) {
          setMessages(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : 'Không thể kết nối đến Trợ lý ảo AI';
          setError(msg);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    messages,
    isLoading,
    isSending,
    error,
    sendMessage,
    refetch: fetchHistory,
  };
};
