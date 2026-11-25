import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, X, Maximize2 } from 'lucide-react';
import { useAiConsultant } from '@/features/customer/hooks/useAiConsultant';
import { AiMessageItem } from './AiMessageItem';
import { AiChatInput } from './AiChatInput';

export const AiConsultantWidget: React.FC = () => {
  const navigate = useNavigate();
  const { messages, isSending, sendMessage } = useAiConsultant();

  const handleClose = () => {
    const el = document.getElementById('ai-consultant-modal');
    if (el) el.classList.add('hidden');
  };

  const handleOpenFullPage = () => {
    handleClose();
    navigate('/ai-consultant');
  };

  return (
    <div
      id="ai-consultant-modal"
      className="hidden fixed bottom-20 right-6 w-[92vw] max-w-xl h-[620px] bg-[var(--surface)] border border-[var(--line-strong)] rounded-lg shadow-xl z-50 flex flex-col overflow-hidden text-[var(--text)]"
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--surface-subtle)] border-b border-[var(--line)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-[var(--text)]">Trợ lý tư vấn xe AutoHub</h3>
            <p className="text-[11px] text-emerald-700">Sẵn sàng hỗ trợ</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleOpenFullPage}
            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text)] rounded-md hover:bg-[var(--surface)] transition-colors cursor-pointer"
            title="Mở toàn màn hình"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text)] rounded-md hover:bg-[var(--surface)] transition-colors cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[var(--bg)]">
        {messages.map((msg) => (
          <AiMessageItem
            key={msg.id}
            message={msg}
            onSelectPrompt={(prompt, carId, carName) => void sendMessage(prompt, carId, carName)}
            isSending={isSending}
          />
        ))}
      </div>

      {/* Bottom Input */}
      <div className="p-3 bg-[var(--surface)] border-t border-[var(--line)]">
        <AiChatInput onSend={(text) => void sendMessage(text)} isSending={isSending} />
        <div className="flex justify-between items-center mt-2 px-1 text-[11px] text-[var(--text-muted)]">
          <span>Tư vấn thông số xe &amp; giữ chỗ 72h</span>
          <button
            type="button"
            onClick={handleOpenFullPage}
            className="text-[var(--accent)] hover:underline cursor-pointer"
          >
            Mở trang tư vấn →
          </button>
        </div>
      </div>
    </div>
  );
};
