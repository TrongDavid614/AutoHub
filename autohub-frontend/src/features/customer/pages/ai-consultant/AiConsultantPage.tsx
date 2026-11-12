import React, { useRef, useEffect } from 'react';
import { AlertCircle, RotateCcw, Loader2 } from 'lucide-react';
import { useAiConsultant } from '@/features/customer/hooks/useAiConsultant';
import { AiHeader } from '@/features/customer/components/AiHeader';
import { AiMessageItem } from '@/features/customer/components/AiMessageItem';
import { AiChatInput } from '@/features/customer/components/AiChatInput';

export const AiConsultantPage: React.FC = () => {
  const { messages, isLoading, isSending, error, sendMessage, refetch } = useAiConsultant();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

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
    <div className="-mx-6 -my-6 min-h-[calc(100vh-4rem)] bg-[#0B1326] text-[#DAE2FD] flex flex-col justify-between p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      {/* Subtle Ambient Glow Canvas matching Figma */}
      <div className="absolute top-0 left-1/4 w-[850px] h-[340px] bg-[#89CEFF]/10 rounded-full blur-[65px] pointer-events-none" />
      <div className="absolute top-[384px] -right-12 w-[420px] h-[420px] bg-[#00A6F0]/5 rounded-full blur-[75px] pointer-events-none" />

      <div className="max-w-[1040px] w-full mx-auto space-y-7 relative z-10 flex-1 flex flex-col">
        {/* Top Assistant Header Section */}
        <AiHeader />

        {/* 1. LOADING STATE */}
        {isLoading && (
          <div className="space-y-4 py-8">
            <div className="h-24 bg-[#131B2E] animate-pulse rounded-lg border border-[#3E4850]/40" />
            <div className="h-64 bg-[#131B2E] animate-pulse rounded-lg border border-[#3E4850]/40" />
            <div className="h-32 bg-[#131B2E] animate-pulse rounded-lg border border-[#3E4850]/40" />
          </div>
        )}

        {/* 2. ERROR STATE */}
        {!isLoading && error && (
          <div className="p-8 text-center bg-[#171F33] border border-rose-500/60 rounded-lg space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Không thể kết nối đến Trợ lý AI</h3>
            <p className="text-xs text-[#BEC8D2]">{error}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="inline-flex items-center gap-1.5 px-4 py-2 mt-2 rounded-[2px] bg-[#222A3D] text-[#89CEFF] border border-[#3E4850] text-xs font-medium hover:bg-[#2D3449] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Thử kết nối lại
            </button>
          </div>
        )}

        {/* 3. EMPTY STATE */}
        {!isLoading && !error && messages.length === 0 && (
          <div className="p-12 text-center bg-[#131B2E] border border-[#3E4850]/40 rounded-lg">
            <p className="text-sm text-[#88929B]">
              Chưa có tin nhắn nào. Hãy đặt câu hỏi để bắt đầu phiên tư vấn thông minh với AI!
            </p>
          </div>
        )}

        {/* 4. CONVERSATION FLOW (Section - Main Conversation Interface) */}
        {!isLoading && !error && messages.length > 0 && (
          <div className="space-y-6 flex-1 pb-4">
            {messages.map((msg) => (
              <AiMessageItem
                key={msg.id}
                message={msg}
                onSelectPrompt={(prompt) => void sendMessage(prompt)}
                isSending={isSending}
              />
            ))}

            {/* Waiting indicator when AI is thinking */}
            {isSending && (
              <div className="flex items-center gap-3 text-xs text-[#89CEFF] p-3 rounded-[4px] bg-[#171F33] border border-[#3E4850]/50 w-fit animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-[#89CEFF]" />
                <span>Trợ lý AI đang phân tích tham số và truy vấn cơ sở dữ liệu AutoHub...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Bottom Chat Input Bar */}
        <div className="sticky bottom-4 pt-2">
          <AiChatInput onSend={(text) => void sendMessage(text)} isSending={isSending} />
        </div>
      </div>
    </div>
  );
};
