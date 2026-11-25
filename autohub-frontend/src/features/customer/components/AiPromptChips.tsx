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
      <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
        <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
        <span>Gợi ý câu hỏi tiếp theo</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(prompt)}
            className="px-3 py-1.5 rounded-lg bg-[var(--surface-subtle)] hover:bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--line)] hover:border-[var(--accent)]/40 text-xs transition-colors text-left disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};
