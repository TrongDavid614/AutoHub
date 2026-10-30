import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

export const ChangePasswordForm: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Vui lòng nhập mật khẩu hiện tại.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Mật khẩu mới phải có tối thiểu 8 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Xác nhận mật khẩu mới không khớp.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setPasswordSuccess('Đổi mật khẩu tài khoản thành công! Vui lòng sử dụng mật khẩu mới cho lần đăng nhập tiếp theo.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 3500);
    }, 800);
  };

  return (
    <div className="rounded-[6px] bg-surface-elevated/80 border border-surface-highlight p-6 shadow-xl space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b border-surface-highlight">
        <Lock className="w-5 h-5 text-accent-primary" />
        <h2 className="text-base font-bold text-text-primary">Bảo Mật & Mật Khẩu</h2>
      </div>

      {passwordSuccess && (
        <div className="p-3 rounded bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{passwordSuccess}</span>
        </div>
      )}
      {passwordError && (
        <div className="p-3 rounded bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{passwordError}</span>
        </div>
      )}

      <form onSubmit={handleChangePassword} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-primary">Mật khẩu hiện tại</label>
          <div className="relative flex items-center">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full h-10 px-3 pr-10 bg-canvas-deep border border-surface-highlight focus:border-accent-primary rounded-[4px] text-xs text-text-primary focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 text-text-muted hover:text-text-primary"
            >
              {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-primary">Mật khẩu mới (Tối thiểu 8 ký tự)</label>
          <div className="relative flex items-center">
            <input
              type={showNewPassword ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full h-10 px-3 pr-10 bg-canvas-deep border border-surface-highlight focus:border-accent-primary rounded-[4px] text-xs text-text-primary focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 text-text-muted hover:text-text-primary"
            >
              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-primary">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full h-10 px-3 bg-canvas-deep border border-surface-highlight focus:border-accent-primary rounded-[4px] text-xs text-text-primary focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-2.5 rounded-[2px] bg-surface-elevated hover:bg-surface-interactive border border-surface-highlight hover:border-accent-primary/60 text-xs font-semibold text-accent-primary transition-all cursor-pointer shadow-sm disabled:opacity-50"
        >
          {isSaving ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu'}
        </button>
      </form>
    </div>
  );
};
