import React from 'react';
import { FileCheck2, X } from 'lucide-react';
import type { TestDriveItem } from '../types';

interface TestDriveEvaluationModalProps {
  evaluation: TestDriveItem | null;
  onClose: () => void;
}

export const TestDriveEvaluationModal: React.FC<TestDriveEvaluationModalProps> = ({
  evaluation,
  onClose,
}) => {
  if (!evaluation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas-deep/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md rounded-xl bg-surface-container border border-surface-highlight p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 border-b border-surface-highlight">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-text-primary">Biên Bản Trải Nghiệm Lái Thử</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded bg-surface-elevated text-text-secondary hover:text-text-primary flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-3 text-xs">
          <div className="p-3 rounded bg-canvas-deep border border-surface-highlight space-y-1">
            <div className="text-text-muted">Mẫu xe trải nghiệm:</div>
            <div className="font-bold text-accent-primary">
              {evaluation.carModelName} - {evaluation.carVariant}
            </div>
            <div className="text-text-secondary font-mono">Xe Demo: {evaluation.demoCarPlate}</div>
          </div>

          <div className="p-3 rounded bg-canvas-deep border border-surface-highlight space-y-1">
            <div className="text-text-muted">
              Ghi chú của chuyên viên kỹ thuật ({evaluation.consultantName}):
            </div>
            <p className="text-text-primary italic leading-relaxed">
              "{evaluation.evaluationNote}"
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-surface-highlight">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-surface-elevated text-xs text-text-primary hover:bg-surface-interactive cursor-pointer transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
