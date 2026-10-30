import React from 'react';
import { Sparkles } from 'lucide-react';

export interface AiPromptChipsProps {
  prompts: string[];
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export const AiPromptChips: React.FC<AiPromptChipsProps> = ({
  prompts,
  onSelectPrompt,
  disabled = false,
}) => {
  if (!prompts || prompts.length === 0) return null;

  return (
    <div className="space-y-2 pt-2">
      <div className="flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#89CEFF]" />
        <span className="font-mono text-[10px] font-bold text-[#88929B] uppercase tracking-[1.5px]">
          GỢI Ý CÂU HỎI TIẾP THEO
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(prompt)}
            className="px-3.5 py-1.5 rounded-[2px] bg-[#171F33] hover:bg-[#222A3D] text-[#89CEFF] border border-[#3E4850]/50 hover:border-[#89CEFF]/50 text-[13px] font-normal transition-all text-left disabled:opacity-50 disabled:pointer-events-none"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};
