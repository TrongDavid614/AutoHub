import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Layers } from 'lucide-react';
import type { CarModelInfo } from '@/features/customer/mocks/accessory.mock';
import { accessoryService } from '@/features/customer/services/accessory.service';

export interface ChangeCarModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: CarModelInfo | null;
  onSelectModel: (model: CarModelInfo | null) => void;
}

export const ChangeCarModelModal: React.FC<ChangeCarModelModalProps> = ({
  isOpen,
  onClose,
  selectedModel,
  onSelectModel,
}) => {
  const [carModels, setCarModels] = useState<CarModelInfo[]>([]);

  useEffect(() => {
    if (isOpen) {
      accessoryService.getCarModels().then((models) => {
        setCarModels(models || []);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45"
    >
      <div className="w-full max-w-xl rounded-xl bg-[var(--surface)] border border-[var(--line)] p-6 shadow-xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
          <div>
            <h3 className="text-lg font-bold text-[var(--text)]">Chọn Dòng Xe Tương Thích</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Hệ thống sẽ lọc các phụ kiện chuẩn hóa theo cấu hình điện áp & khung gầm xe của bạn.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-subtle)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Models */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {/* Option 0: All Car Models */}
          <div
            onClick={() => {
              onSelectModel(null);
              onClose();
            }}
            className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
              selectedModel === null
                ? 'bg-[var(--accent-soft)]/50 border-[var(--accent)] ring-1 ring-[var(--accent)]/20'
                : 'bg-[var(--surface)] border-[var(--line)] hover:bg-[var(--surface-subtle)]'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--accent-soft)] border border-[var(--line)] flex items-center justify-center flex-shrink-0 text-[var(--accent)]">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-[var(--text)]">Tất Cả Dòng Xe</span>
                  <span className="px-2 py-0.5 rounded-md bg-[var(--accent-soft)] text-xs font-medium text-[var(--accent)]">
                    Toàn bộ danh mục
                  </span>
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">
                  Xem tất cả phụ kiện và trạm sạc không phân biệt đời xe
                </div>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded border flex items-center justify-center ${
                selectedModel === null
                  ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                  : 'border-[var(--line)] bg-[var(--surface)]'
              }`}
            >
              {selectedModel === null && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </div>
          </div>

          {carModels.map((model) => {
            const isSelected = selectedModel?.id === model.id;
            return (
              <div
                key={model.id}
                onClick={() => {
                  onSelectModel(model);
                  onClose();
                }}
                className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[var(--accent-soft)]/50 border-[var(--accent)] ring-1 ring-[var(--accent)]/20'
                    : 'bg-[var(--surface)] border-[var(--line)] hover:bg-[var(--surface-subtle)]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--surface-subtle)] border border-[var(--line)] flex items-center justify-center flex-shrink-0">
                    <img src={model.thumbnailUrl} alt={model.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[var(--text)]">{model.name}</span>
                      <span className="px-2 py-0.5 rounded-md bg-[var(--surface-subtle)] text-xs font-medium text-[var(--text-2)]">
                        {model.architecture}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--text-muted)] tabular-nums mt-1">
                      Năm sản xuất: {model.yearRange} • {model.accessoryCount} phụ kiện sẵn sàng
                    </div>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center ${
                    isSelected
                      ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                      : 'border-[var(--line)] bg-[var(--surface)]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end border-t border-[var(--line)]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-subtle)] border border-[var(--line)] text-[var(--text)] text-xs font-medium cursor-pointer transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
