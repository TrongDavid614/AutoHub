import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Sparkles,
  Link as LinkIcon,
  Check,
  AlertCircle,
  Loader2,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { profileService } from '@/features/customer/services/profile.service';

export interface AvatarChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarUrl?: string;
  onSuccess?: (newAvatarUrl: string) => void;
}

interface PresetAvatar {
  id: string;
  name: string;
  url: string;
}

const PRESET_AVATARS: PresetAvatar[] = [
  {
    id: 'preset-1',
    name: 'Doanh nhân VIP',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'preset-2',
    name: 'Tay lái Thể thao',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'preset-3',
    name: 'Chuyên gia Xe điện',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'preset-4',
    name: 'Tay đua Chuyên nghiệp',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'preset-5',
    name: 'Quản gia Chuyên cơ',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'preset-6',
    name: 'Kỹ sư SiC High-tech',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'preset-7',
    name: 'Chủ nhân Du thuyền',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'preset-8',
    name: 'Phi công Đường đua',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'preset-9',
    name: 'Nhà sưu tầm Cổ điển',
    url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'preset-10',
    name: 'Phượt thủ Địa hình',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'preset-11',
    name: 'Hội viên Quán quân',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'preset-12',
    name: 'Titanium Elite',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
  },
];

type ActiveTab = 'upload' | 'preset' | 'url';

export const AvatarChangeModal: React.FC<AvatarChangeModalProps> = ({
  isOpen,
  onClose,
  currentAvatarUrl,
  onSuccess,
}) => {
  const { user, updateUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<ActiveTab>('upload');

  // Upload local file state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string>('');

  // Preset gallery state
  const [selectedPresetUrl, setSelectedPresetUrl] = useState<string>(
    currentAvatarUrl || PRESET_AVATARS[0].url
  );

  // Custom URL state
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [customUrlPreview, setCustomUrlPreview] = useState<string>('');
  const [isCustomUrlValid, setIsCustomUrlValid] = useState<boolean>(true);

  // Status & loading
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  if (!isOpen) return null;

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Dung lượng ảnh vượt quá giới hạn 5MB. Vui lòng chọn ảnh nhỏ hơn.');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setErrorMsg('File được chọn không phải là định dạng hình ảnh hợp lệ.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(objectUrl);
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setErrorMsg('');
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Dung lượng ảnh vượt quá 5MB. Vui lòng chọn ảnh nhẹ hơn.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Vui lòng kéo thả file hình ảnh (JPG, PNG, WebP).');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setLocalPreviewUrl(objectUrl);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Handle saving avatar
  const handleSave = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setIsSaving(true);

    try {
      let finalAvatarUrl: string | null = null;

      if (activeTab === 'upload') {
        if (!selectedFile) {
          setErrorMsg('Vui lòng chọn một file ảnh từ thiết bị của bạn trước.');
          setIsSaving(false);
          return;
        }
        finalAvatarUrl = await profileService.uploadAvatar(selectedFile, user?.id);
        if (!finalAvatarUrl) {
          setErrorMsg('Tải ảnh lên máy chủ thất bại. Vui lòng thử lại sau.');
          setIsSaving(false);
          return;
        }
      } else if (activeTab === 'preset') {
        if (!selectedPresetUrl) {
          setErrorMsg('Vui lòng chọn một avatar từ bộ sưu tập VIP.');
          setIsSaving(false);
          return;
        }
        const ok = await profileService.updateAvatar(selectedPresetUrl, user?.id);
        if (!ok) {
          setErrorMsg('Cập nhật avatar bộ sưu tập thất bại. Vui lòng thử lại.');
          setIsSaving(false);
          return;
        }
        finalAvatarUrl = selectedPresetUrl;
      } else if (activeTab === 'url') {
        const trimmed = customUrlInput.trim();
        if (!trimmed) {
          setErrorMsg('Vui lòng dán liên kết URL hình ảnh đại diện.');
          setIsSaving(false);
          return;
        }
        if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
          setErrorMsg('Đường dẫn ảnh phải bắt đầu bằng http:// hoặc https://.');
          setIsSaving(false);
          return;
        }
        const ok = await profileService.updateAvatar(trimmed, user?.id);
        if (!ok) {
          setErrorMsg('Cập nhật đường dẫn ảnh thất bại. Vui lòng thử lại.');
          setIsSaving(false);
          return;
        }
        finalAvatarUrl = trimmed;
      }

      if (finalAvatarUrl) {
        // Đồng bộ store toàn cục ngay lập tức
        updateUser({ avatarUrl: finalAvatarUrl });
        setSuccessMsg('Đổi ảnh đại diện thành công!');
        onSuccess?.(finalAvatarUrl);

        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch {
      setErrorMsg('Đã xảy ra lỗi trong quá trình cập nhật ảnh đại diện.');
    } finally {
      setIsSaving(false);
    }
  };

  // Preview to show in the header summary circle
  const activePreviewUrl =
    activeTab === 'upload'
      ? localPreviewUrl || currentAvatarUrl || PRESET_AVATARS[0].url
      : activeTab === 'preset'
      ? selectedPresetUrl
      : customUrlPreview || currentAvatarUrl || PRESET_AVATARS[0].url;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[var(--line)] flex items-center justify-between bg-[var(--surface-subtle)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center border border-red-500/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text)]">Thay Đổi Ảnh Đại Diện</h2>
              <p className="text-xs text-[var(--text-muted)]">
                Cập nhật ảnh đại diện cá nhân trên hệ thống AutoHub
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="w-8 h-8 rounded-lg border border-[var(--line)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Avatar Preview Trung Tâm */}
          <div className="flex items-center justify-center gap-5 p-4 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)]">
            <div className="relative">
              <img
                src={activePreviewUrl}
                alt="Avatar Preview"
                className="w-20 h-20 rounded-full object-cover border-3 border-red-600 shadow-md ring-4 ring-red-500/10"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 border-2 border-[var(--surface)] flex items-center justify-center text-white">
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-left space-y-1">
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-red-500/10 text-red-600 border border-red-500/20">
                Xem trước trực quan
              </span>
              <p className="text-sm font-bold text-[var(--text)]">{user?.fullName || 'Hội viên AutoHub'}</p>
              <p className="text-xs text-[var(--text-muted)]">
                Hình ảnh sẽ được đồng bộ ngay lập tức trên thanh tiêu đề và hồ sơ
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)]">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Tải file lên</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preset')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'preset'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bộ sưu tập VIP</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'url'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Link URL</span>
            </button>
          </div>

          {/* Tab 1: Upload File Local */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[var(--line)] hover:border-red-500 rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-colors bg-[var(--surface-subtle)] hover:bg-red-50/20 group"
              >
                <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[var(--text)]">
                    Nhấp để chọn ảnh hoặc kéo thả vào đây
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Hỗ trợ định dạng PNG, JPG, JPEG, WebP hoặc GIF (Tối đa 5MB)
                  </p>
                </div>
                {selectedFile && (
                  <div className="mt-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium flex items-center gap-1.5 border border-emerald-200">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      Đã chọn: <strong>{selectedFile.name}</strong> ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Preset Avatars Gallery */}
          {activeTab === 'preset' && (
            <div className="space-y-3">
              <p className="text-xs text-[var(--text-muted)]">
                Chọn hình ảnh phong cách VIP độc quyền được thiết kế dành cho cộng đồng chủ sở hữu xe AutoHub:
              </p>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-56 overflow-y-auto p-1">
                {PRESET_AVATARS.map((preset) => {
                  const isSelected = selectedPresetUrl === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedPresetUrl(preset.url)}
                      className={`group relative rounded-xl p-1 border-2 transition-all cursor-pointer flex flex-col items-center gap-1 text-center ${
                        isSelected
                          ? 'border-red-600 bg-red-500/10 shadow-md scale-105'
                          : 'border-[var(--line)] hover:border-red-400 bg-[var(--surface)]'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <span className="text-[10px] font-medium text-[var(--text-muted)] group-hover:text-[var(--text)] line-clamp-1">
                        {preset.name}
                      </span>
                      {isSelected && (
                        <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Custom URL */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--text)] flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-red-600" />
                  <span>Dán đường dẫn ảnh trực tiếp (Image URL)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => {
                      setCustomUrlInput(e.target.value);
                      setIsCustomUrlValid(true);
                    }}
                    placeholder="https://example.com/my-avatar.jpg"
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-red-600"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customUrlInput.trim()) {
                        setCustomUrlPreview(customUrlInput.trim());
                      }
                    }}
                    className="px-3 py-2 rounded-lg bg-[var(--surface-subtle)] hover:bg-[var(--line)] border border-[var(--line)] text-xs font-semibold text-[var(--text)] transition-colors cursor-pointer"
                  >
                    Kiểm tra
                  </button>
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Đường dẫn công khai từ Google Drive, Imgur, Cloudinary hoặc máy chủ ảnh của bạn.
                </p>
              </div>

              {customUrlPreview && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-subtle)] border border-[var(--line)]">
                  <img
                    src={customUrlPreview}
                    alt="Custom URL Preview"
                    className="w-12 h-12 rounded-full object-cover border border-[var(--line)]"
                    onError={() => setIsCustomUrlValid(false)}
                    onLoad={() => setIsCustomUrlValid(true)}
                  />
                  <div className="text-xs">
                    {isCustomUrlValid ? (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Ảnh tải thành công và sẵn sàng áp dụng</span>
                      </span>
                    ) : (
                      <span className="text-red-700 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                        <span>Không thể tải ảnh từ URL này. Vui lòng kiểm tra lại quyền truy cập link.</span>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Feedback messages */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[var(--line)] flex items-center justify-end gap-3 bg-[var(--surface-subtle)]">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--line)] text-[var(--text-secondary)] transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 shadow-md transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang lưu ảnh...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Lưu ảnh đại diện</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
