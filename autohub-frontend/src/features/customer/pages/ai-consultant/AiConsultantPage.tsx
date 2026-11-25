import React, { useRef, useEffect } from 'react';
import { AlertCircle, RotateCcw, Loader2 } from 'lucide-react';
import { useAiConsultant } from '@/features/customer/hooks/useAiConsultant';
import { AiHeader } from '@/features/customer/components/AiHeader';
import { AiMessageItem } from '@/features/customer/components/AiMessageItem';
import { AiChatInput } from '@/features/customer/components/AiChatInput';
import { usePageTracking } from '@/hooks/usePageTracking';

export const AiConsultantPage: React.FC = () => {
  const { messages, isLoading, isSending, error, sendMessage, refetch } = useAiConsultant();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  const { trackAction } = usePageTracking({
    loaiThucThe: 'AI_CONSULTANT',
    metadata: {
      initialMessageCount: messages.length,
    },
  });

  const handleSendMessage = (text: string, carId?: number, carName?: string) => {
    trackAction('AI_CONSULTANT_QUERY', {
      queryLength: text.length,
      carId,
      carName,
    });
    void sendMessage(text, carId, carName);
  };

  // Chỉ cuộn xuống khi người dùng gửi tin nhắn hoặc nhận phản hồi mới (tránh nhảy trang khi vừa vào)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (messages.length > 2 || isSending) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages.length, isSending]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--bg)] text-[var(--text)] flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[960px] w-full mx-auto space-y-6 flex-1 flex flex-col">
        {/* Top Assistant Header Section */}
        <AiHeader />

        {/* 1. LOADING STATE */}
        {isLoading && (
          <div className="space-y-4 py-6">
            <div className="h-24 bg-[var(--surface)] rounded-lg border border-[var(--line)]" />
            <div className="h-48 bg-[var(--surface)] rounded-lg border border-[var(--line)]" />
          </div>
        )}

        {/* 2. ERROR STATE */}
        {!isLoading && error && (
          <div className="p-8 text-center bg-[var(--surface)] border border-red-200 rounded-lg space-y-3">
            <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
            <h3 className="text-base font-semibold text-[var(--text)]">Không thể kết nối tới trợ lý tư vấn</h3>
            <p className="text-xs text-[var(--text-secondary)]">{error}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="inline-flex items-center gap-1.5 px-4 py-2 mt-1 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-xs font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Thử lại
            </button>
          </div>
        )}

        {/* 3. EMPTY STATE */}
        {!isLoading && !error && messages.length === 0 && (
          <div className="p-10 text-center bg-[var(--surface)] border border-[var(--line)] rounded-lg">
            <p className="text-sm text-[var(--text-secondary)]">
              Hãy đặt câu hỏi về dòng xe, mức giá hoặc chi phí lăn bánh để được tư vấn chi tiết.
            </p>
          </div>
        )}

        {/* 4. CONVERSATION FLOW */}
        {!isLoading && !error && messages.length > 0 && (
          <div className="space-y-5 flex-1 pb-4">
            {messages.map((msg) => (
              <AiMessageItem
                key={msg.id}
                message={msg}
                onSelectPrompt={(prompt, carId, carName) => void handleSendMessage(prompt, carId, carName)}
                isSending={isSending}
              />
            ))}

            {isSending && (
              <div className="flex items-center gap-2.5 text-xs text-[var(--text-secondary)] px-3.5 py-2.5 rounded-lg bg-[var(--surface)] border border-[var(--line)] w-fit">
                <Loader2 className="w-4 h-4 animate-spin text-[var(--accent)]" />
                <span>Đang kiểm tra dữ liệu xe và tính toán gợi ý...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Bottom Chat Input Bar */}
        <div className="sticky bottom-4 pt-2">
          <AiChatInput onSend={(text) => void handleSendMessage(text)} isSending={isSending} />
        </div>
      </div>
    </div>
  );
};
