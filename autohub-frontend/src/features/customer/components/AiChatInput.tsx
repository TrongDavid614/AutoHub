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
      className="flex items-center gap-2 p-2 rounded-lg bg-[var(--surface)] border border-[var(--line-strong)] shadow-sm focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent-soft)] transition-colors"
    >
      <input
        type="text"
        value={text}
        disabled={isSending}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Hỏi về dòng xe, dự toán lăn bánh, đặt cọc hoặc phụ kiện..."
        className="flex-1 bg-transparent px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none disabled:opacity-50"
      />

      <button
        type="submit"
        disabled={!text.trim() || isSending}
        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium text-xs transition-colors disabled:opacity-50 disabled:pointer-events-none shrink-0 cursor-pointer"
      >
        {isSending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="hidden sm:inline">Đang xử lý...</span>
          </>
        ) : (
          <>
            <span>Gửi</span>
            <Send className="w-3.5 h-3.5" />
          </>
        )}
      </button>
    </form>
  );
};
