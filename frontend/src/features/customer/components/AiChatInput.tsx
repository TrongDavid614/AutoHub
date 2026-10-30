import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

export interface AiChatInputProps {
  onSend: (text: string) => void;
  isSending?: boolean;
}

export const AiChatInput: React.FC<AiChatInputProps> = ({ onSend, isSending = false }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSending) return;
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center gap-2 p-2 rounded-[4px] bg-[#131B2E] border border-[#3E4850]/70 shadow-2xl focus-within:border-[#89CEFF]/60 transition-colors"
    >
      <input
        type="text"
        value={text}
        disabled={isSending}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Hỏi AI bất kỳ điều gì về dòng xe, chính sách pin, trả góp hoặc ưu đãi..."
        className="flex-1 bg-transparent px-4 py-2.5 text-[14px] text-[#DAE2FD] placeholder-[#88929B] focus:outline-none disabled:opacity-50"
      />

      {/* Button Gửi câu hỏi matching Figma: background #89CEFF, text #00344D */}
      <button
        type="submit"
        disabled={!text.trim() || isSending}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[2px] bg-[#89CEFF] hover:bg-[#89CEFF]/90 text-[#00344D] font-bold text-[13px] shadow-[0_4px_6px_-1px_rgba(137,206,255,0.25)] transition-all disabled:opacity-50 disabled:pointer-events-none flex-shrink-0"
      >
        {isSending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-[#00344D]" />
            <span className="hidden sm:inline">Đang đối soát...</span>
          </>
        ) : (
          <>
            <span>Gửi câu hỏi</span>
            <Send className="w-3.5 h-3.5 fill-[#00344D] text-[#00344D]" />
          </>
        )}
      </button>
    </form>
  );
};
