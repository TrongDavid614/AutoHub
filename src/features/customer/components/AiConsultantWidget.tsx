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
      className="hidden fixed bottom-20 right-6 w-[92vw] max-w-xl h-[650px] bg-[#0B1326] border border-[#3E4850]/80 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden text-[#DAE2FD]"
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-[#131B2E] border-b border-[#3E4850]/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[4px] bg-[#222A3D] text-[#89CEFF] flex items-center justify-center border border-[#3E4850]/50 shadow-sm">
            <Bot className="w-4 h-4 text-[#89CEFF]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xs text-[#DAE2FD]">AutoHub Intelligence AI</h3>
              <span className="px-1.5 py-0.2 rounded-[2px] bg-[#2D3449] text-[#89CEFF] font-mono text-[9px] font-bold">
                v3.5
              </span>
            </div>
            <p className="font-mono text-[9px] text-[#89CEFF]">TRỰC TUYẾN 24/7</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleOpenFullPage}
            className="p-1.5 text-[#88929B] hover:text-white rounded-[4px] hover:bg-[#222A3D] transition-colors"
            title="Mở toàn màn hình"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-[#88929B] hover:text-white rounded-[4px] hover:bg-[#222A3D] transition-colors"
            title="Đóng cửa sổ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <AiMessageItem
            key={msg.id}
            message={msg}
            onSelectPrompt={(prompt) => void sendMessage(prompt)}
            isSending={isSending}
          />
        ))}
      </div>

      {/* Bottom Input */}
      <div className="p-3 bg-[#131B2E] border-t border-[#3E4850]/80">
        <AiChatInput onSend={(text) => void sendMessage(text)} isSending={isSending} />
        <div className="flex justify-between items-center mt-2 px-1 text-[10px] text-[#88929B]">
          <span>Hỗ trợ tư vấn thông số xe & cọc giữ chỗ 72h</span>
          <button
            type="button"
            onClick={handleOpenFullPage}
            className="text-[#89CEFF] hover:underline text-[10px]"
          >
            Mở giao diện lớn →
          </button>
        </div>
      </div>
    </div>
  );
};
