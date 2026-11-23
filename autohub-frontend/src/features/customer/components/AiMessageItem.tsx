import React from 'react';
import { Bot, Database, User } from 'lucide-react';
import type { AiChatMessage } from '@/types/ai.types';
import { cn } from '@/lib/utils';
import { RecommendedCarCard } from './RecommendedCarCard';
import { RecommendedAccessoryCard } from './RecommendedAccessoryCard';
import { RolloutFeeCard } from './RolloutFeeCard';
import { InventoryStockCard } from './InventoryStockCard';
import { DepositPolicyCard } from './DepositPolicyCard';
import { AiPromptChips } from './AiPromptChips';

export interface AiMessageItemProps {
  message: AiChatMessage;
  onSelectPrompt: (prompt: string, contextCarId?: number, contextCarName?: string) => void;
  isSending?: boolean;
}

export const formatSuggestedPrompts = (prompts: string[], carName?: string): string[] => {
  if (!carName || !prompts) return prompts ?? [];
  return prompts.map((p) => {
    if (p.includes(carName)) return p;
    if (p.startsWith('Tính chi phí lăn bánh')) {
      return p.replace('Tính chi phí lăn bánh', `Tính chi phí lăn bánh ${carName}`);
    }
    if (p.startsWith('Kiểm tra tồn kho')) {
      return p
        .replace('Kiểm tra tồn kho xe sẵn giao', `Kiểm tra tồn kho ${carName} sẵn giao`)
        .replace('Kiểm tra tồn kho xe có sẵn', `Kiểm tra tồn kho ${carName} sẵn giao`)
        .replace('Kiểm tra tồn kho', `Kiểm tra tồn kho ${carName}`);
    }
    if (p.startsWith('Đặt cọc giữ xe') && !p.includes(carName)) {
      return `Đặt cọc giữ xe ${carName} 72h ngay bây giờ`;
    }
    return p;
  });
};

const parseInlineMarkdown = (text: string): React.ReactNode[] => {
  if (!text) return [];

  // Match **bold** OR `code` OR *italic*
  const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`|\*(?:(?!\*)[^\s])(?:(?!\*)[^\n])*?(?:(?!\*)[^\s])\*|\*(?:(?!\*)\S)\*)/g;
  const parts = text.split(tokenRegex);

  return parts
    .map((part, pIdx) => {
      if (!part) return null;

      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return (
          <strong key={pIdx} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }

      if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
        return (
          <code
            key={pIdx}
            className="px-1.5 py-0.5 rounded bg-[#131B2E] text-[#89CEFF] font-mono text-xs border border-[#3E4850]/40"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      if (
        part.startsWith('*') &&
        part.endsWith('*') &&
        part.length >= 2 &&
        !part.startsWith('**')
      ) {
        return (
          <em key={pIdx} className="italic text-[#89CEFF]">
            {part.slice(1, -1)}
          </em>
        );
      }

      return part;
    })
    .filter(Boolean);
};

const renderFormattedMessageContent = (content: string) => {
  const lines = content.split('\n');

  return (
    <div className="space-y-1 text-[15px] leading-[24px]">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // 1. Phân cách ngang
        if (trimmed.startsWith('───') || trimmed.startsWith('---') || trimmed.startsWith('***')) {
          return <hr key={idx} className="my-2 border-[#3E4850]/50" />;
        }

        // 2. Dòng trống
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // 2b. 👇 BỔ SUNG: Hiển thị hình ảnh Markdown (Mã QR VietQR chuyển khoản)
        const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
        if (imgMatch) {
          return (
            <div key={idx} className="my-3 p-3 bg-white rounded-xl border border-cyan-500/40 inline-block shadow-xl">
              <img
                src={imgMatch[2]}
                alt={imgMatch[1]}
                className="w-52 h-52 sm:w-60 sm:h-60 object-contain mx-auto"
              />
              <p className="text-[12px] text-center text-slate-800 mt-2 font-mono font-semibold">{imgMatch[1]}</p>
            </div>
          );
        }

        // 3. Tiêu đề Markdown: ###, ##, #
        const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
        if (headingMatch) {
          return (
            <div
              key={idx}
              className="text-[16px] font-bold text-white tracking-wide pt-1.5 pb-0.5"
            >
              {parseInlineMarkdown(headingMatch[2])}
            </div>
          );
        }

        // 4. Danh sách gạch đầu dòng (• hoặc - hoặc *)
        const bulletMatch = trimmed.match(/^([•\-\*])\s+(.+)$/);
        if (bulletMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2 text-[#DAE2FD]">
              <span className="text-[#89CEFF] select-none font-bold mt-0.5">•</span>
              <span className="flex-1 break-words">{parseInlineMarkdown(bulletMatch[2])}</span>
            </div>
          );
        }

        // 5. Dòng bắt đầu bằng icon / emoji
        const isHeaderEmoji =
          trimmed.startsWith('🚗') ||
          trimmed.startsWith('📊') ||
          trimmed.startsWith('🏆') ||
          trimmed.startsWith('💰') ||
          trimmed.startsWith('👉') ||
          trimmed.startsWith('💡') ||
          trimmed.startsWith('📍') ||
          trimmed.startsWith('🛠️') ||
          trimmed.startsWith('🎯') ||
          trimmed.startsWith('👋');

        return (
          <p
            key={idx}
            className={cn(
              'break-words',
              isHeaderEmoji ? 'font-medium text-white' : 'text-[#DAE2FD]'
            )}
          >
            {parseInlineMarkdown(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

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

          <div className="p-4 rounded-lg bg-[#222A3D] border border-[#3E4850]/40 shadow-md text-[15px] text-[#DAE2FD] leading-[24px] whitespace-pre-line break-words">
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

        {/* 1. Plain Content bubble matching Figma: bg #171F33 with markdown formatting & clean line breaks */}
        {message.content && (
          <div className="p-4 rounded-lg bg-[#171F33] border border-[#3E4850]/40 shadow-sm text-[15px] text-[#DAE2FD] leading-[24px] whitespace-pre-line break-words">
            {renderFormattedMessageContent(message.content)}
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

        {/* 4. Generative UI Blocks theo uiBlockType */}
        {/* Block: CAR_CARD */}
        {(message.uiBlockType === 'CAR_CARD' || (!message.uiBlockType && message.recommendedVehicle)) &&
          message.recommendedVehicle && (
            <RecommendedCarCard vehicle={message.recommendedVehicle} />
          )}

        {/* Block: ROLLOUT_TABLE */}
        {message.uiBlockType === 'ROLLOUT_TABLE' && message.rolloutFeeData && (
          <RolloutFeeCard data={message.rolloutFeeData} />
        )}

        {/* Block: INVENTORY_CARD */}
        {message.uiBlockType === 'INVENTORY_CARD' && (message.inventoryData ?? []).length > 0 && (
          <InventoryStockCard stocks={message.inventoryData ?? []} />
        )}

        {/* Block: DEPOSIT_POLICY */}
        {message.uiBlockType === 'DEPOSIT_POLICY' && <DepositPolicyCard />}

        {/* Block: ACCESSORY_LIST */}
        {(message.uiBlockType === 'ACCESSORY_LIST' || (!message.uiBlockType && message.recommendedAccessory)) &&
          message.recommendedAccessory && (
            <RecommendedAccessoryCard accessory={message.recommendedAccessory} />
          )}

        {/* 6. Next Prompts Chips */}
        {message.suggestedPrompts && message.suggestedPrompts.length > 0 && (
          <AiPromptChips
            prompts={formatSuggestedPrompts(message.suggestedPrompts, message.recommendedVehicle?.name)}
            onSelectPrompt={(selectedPrompt) =>
              onSelectPrompt(
                selectedPrompt,
                message.recommendedVehicle?.variantId,
                message.recommendedVehicle?.name
              )
            }
            disabled={isSending}
          />
        )}
      </div>
    </div>
  );
};
