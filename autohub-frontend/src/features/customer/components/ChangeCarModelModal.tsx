import React from 'react';
import { X, Check } from 'lucide-react';
import { MOCK_CAR_MODELS, type CarModelInfo } from '@/features/customer/mocks/accessory.mock';

export interface ChangeCarModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: CarModelInfo;
  onSelectModel: (model: CarModelInfo) => void;
}

export const ChangeCarModelModal: React.FC<ChangeCarModelModalProps> = ({
  isOpen,
  onClose,
  selectedModel,
  onSelectModel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#060E20]/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl rounded-[2px] bg-[#131B2E] border border-[#2D3449] p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2D3449]">
          <div>
            <h3 className="text-lg font-bold text-[#DAE2FD]">Chọn Dòng Xe Tương Thích</h3>
            <p className="text-xs text-[#88929B] mt-0.5">
              Hệ thống sẽ lọc các phụ kiện chuẩn hóa theo cấu hình điện áp & khung gầm xe của bạn.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[2px] text-[#88929B] hover:text-[#DAE2FD] hover:bg-[#222A3D] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Models */}
        <div className="space-y-3">
          {MOCK_CAR_MODELS.map((model) => {
            const isSelected = selectedModel.id === model.id;
            return (
              <div
                key={model.id}
                onClick={() => {
                  onSelectModel(model);
                  onClose();
                }}
                className={`flex items-center justify-between p-4 rounded-[2px] border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#171F33] border-[#89CEFF] shadow-lg'
                    : 'bg-[#171F33]/50 border-[#2D3449] hover:bg-[#171F33] hover:border-[#3E4850]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[2px] overflow-hidden bg-[#060E20] border border-[#2D3449] flex items-center justify-center flex-shrink-0">
                    <img src={model.thumbnailUrl} alt={model.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#DAE2FD]">{model.name}</span>
                      <span className="px-1.5 py-0.5 rounded-[2px] bg-[#222A3D] text-[9px] font-mono text-[#89CEFF]">
                        {model.architecture}
                      </span>
                    </div>
                    <div className="text-xs text-[#88929B] mt-1">
                      Năm sản xuất: {model.yearRange} • {model.accessoryCount} phụ kiện sẵn sàng
                    </div>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-[2px] border flex items-center justify-center ${
                    isSelected
                      ? 'bg-[#89CEFF] border-[#89CEFF] text-[#060E20]'
                      : 'border-[#3E4850] bg-[#060E20]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-[2px] bg-[#222A3D] hover:bg-[#2D3449] text-[#DAE2FD] text-xs font-semibold cursor-pointer transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
