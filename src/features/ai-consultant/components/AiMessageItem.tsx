import React from 'react';
import { Bot, Database, User } from 'lucide-react';
import type { AiChatMessage } from '@/types/ai.types';
import { RecommendedCarCard } from './RecommendedCarCard';
import { RecommendedAccessoryCard } from './RecommendedAccessoryCard';
import { AiPromptChips } from './AiPromptChips';

export interface AiMessageItemProps {
  message: AiChatMessage;
  onSelectPrompt: (prompt: string) => void;
  isSending?: boolean;
}

export const AiMessageItem: React.FC<AiMessageItemProps> = ({
  message,
  onSelectPrompt,
  isSending = false,
}) => {
  const isUser = message.sender === 'USER';

  if (isUser) {
    return (
      <div className="flex justify-end items-start gap-2.5 w-full">
        <div className="flex flex-col items-end gap-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-[#88929B] tracking-[1.32px]">
              {message.timestamp}
            </span>
            <span className="text-[15px] font-normal text-[#DAE2FD]">{message.senderTitle}</span>
          </div>

          <div className="p-4 rounded-lg bg-[#222A3D] border border-[#3E4850]/40 shadow-md text-[15px] text-[#DAE2FD] leading-[24px]">
            {message.content}
          </div>
        </div>

        {/* User Avatar matching Figma: bg #89CEFF, text #00344D circle */}
        <div className="w-8 h-8 rounded-full bg-[#89CEFF] text-[#00344D] font-normal text-[13px] flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
          {message.avatarText ? message.avatarText : <User className="w-4 h-4 text-[#00344D]" />}
        </div>
      </div>
    );
  }

  // AI Message
  return (
    <div className="flex items-start gap-2.5 w-full">
      {/* AI Bot Avatar matching Figma: bg #222A3D with #89CEFF icon */}
      <div className="w-8 h-8 rounded-[4px] bg-[#222A3D] border border-[#3E4850]/50 text-[#89CEFF] flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
        <Bot className="w-4 h-4 text-[#89CEFF]" />
      </div>

      <div className="flex-1 space-y-3.5 max-w-4xl">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-normal text-[#89CEFF]">{message.senderTitle}</span>
          <span className="font-mono text-[11px] text-[#88929B] tracking-[1.32px]">
            {message.timestamp}
          </span>
        </div>

        {/* 1. Plain Content bubble matching Figma: bg #171F33 */}
        {message.content && (
          <div className="p-4 rounded-lg bg-[#171F33] border border-[#3E4850]/40 shadow-sm text-[15px] text-[#DAE2FD] leading-[24px]">
            {message.content}
          </div>
        )}

        {/* 2. Function Calling Notification Bar matching Figma */}
        {message.functionCall && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-[4px] bg-[#131B2E] border border-cyan-500/30 text-[13px] text-[#89CEFF] shadow-sm">
            <Database className="w-4 h-4 text-[#89CEFF] flex-shrink-0" />
            <div className="flex flex-wrap items-center gap-1.5">
              <span>Đã đối soát cơ sở dữ liệu:</span>
              <span className="font-normal text-white">{message.functionCall.querySegment}</span>
              <span>• Độ phù hợp</span>
              <span className="font-mono font-bold text-[#89CEFF]">
                {message.functionCall.matchPercentage}%
              </span>
            </div>
          </div>
        )}

        {/* 3. Conversational Rationale matching Figma: bg #171F33 */}
        {message.rationale && (
          <div className="p-4 rounded-lg bg-[#171F33] border border-[#3E4850]/40 shadow-sm text-[15px] text-[#BEC8D2] leading-[24px] space-y-2">
            {message.rationale.split('\n\n').map((paragraph, pIdx) => (
              <p key={pIdx}>
                {pIdx === 0 ? (
                  <>
                    <span>Dựa trên ngân sách </span>
                    <span className="text-[#DAE2FD] font-semibold">2.5 – 3 tỷ VNĐ</span>
                    <span> và tiêu chí tìm kiếm sedan điện cao cấp phục vụ gia đình, lựa chọn hoàn hảo nhất trong hệ sinh thái AutoHub là mẫu </span>
                    <span className="text-[#89CEFF] font-semibold">AutoHub GT-e phiên bản Grand Touring</span>
                    <span>. Mẫu xe này sở hữu khoang nội thất rộng rãi chuẩn thương gia, chiều dài cơ sở gần 3m, hệ thống lọc không khí ion âm và công nghệ tự hành cấp độ 2+ mang lại sự an tâm tuyệt đối cho các chuyến đi của cả gia đình.</span>
                  </>
                ) : (
                  paragraph
                )}
              </p>
            ))}
          </div>
        )}

        {/* 4. Embedded Recommended Vehicle Card */}
        {message.recommendedVehicle && (
          <RecommendedCarCard vehicle={message.recommendedVehicle} />
        )}

        {/* 5. Embedded Recommended Accessory Card */}
        {message.recommendedAccessory && (
          <RecommendedAccessoryCard accessory={message.recommendedAccessory} />
        )}

        {/* 6. Next Prompts Chips */}
        {message.suggestedPrompts && message.suggestedPrompts.length > 0 && (
          <AiPromptChips
            prompts={message.suggestedPrompts}
            onSelectPrompt={onSelectPrompt}
            disabled={isSending}
          />
        )}
      </div>
    </div>
  );
};
