import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft, Building2, Home } from 'lucide-react';
import { MOCK_CUSTOMER_PROFILE, type MockAddressItem } from '@/mock/mockData';

export const AddressBookPage: React.FC = () => {
  const [addresses, setAddresses] = useState<MockAddressItem[]>(MOCK_CUSTOMER_PROFILE.savedAddresses);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newRecipient, setNewRecipient] = useState<string>('Nguyễn Văn A');
  const [newPhone, setNewPhone] = useState<string>('0912 345 678');
  const [newAddress, setNewAddress] = useState<string>('');
  const [newNote, setNewNote] = useState<string>('');

  const handleSetDefault = (id: number) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc muốn xóa địa chỉ này khỏi sổ địa chỉ?')) {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAddress) return;

    const newItem: MockAddressItem = {
      id: Date.now(),
      title: newTitle,
      recipientName: newRecipient,
      phoneNumber: newPhone,
      fullAddress: newAddress,
      isDefault: addresses.length === 0,
      note: newNote || undefined,
    };

    setAddresses([...addresses, newItem]);
    setShowAddModal(false);
    setNewTitle('');
    setNewAddress('');
    setNewNote('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link to="/customer/profile" className="hover:text-cyan-400 flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3 h-3" />
              <span>Quay lại Trung tâm giao dịch</span>
            </Link>
            <span>/</span>
            <span className="text-slate-200 font-semibold">Sổ địa chỉ</span>
          </nav>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Sổ Địa Chỉ Giao Nhận & Trạm Sạc (UC03)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Quản lý địa chỉ giao hàng phụ kiện chính hãng và vị trí khảo sát lắp trạm sạc HubWall 22kW.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Địa Chỉ Mới</span>
        </button>
      </div>

      {/* Address Cards List */}
      <div className="space-y-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`p-5 rounded-2xl border transition-all ${
              addr.isDefault
                ? 'bg-slate-900/90 border-cyan-500/50 shadow-xl shadow-cyan-500/5'
                : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400">
                  {addr.title.toLowerCase().includes('văn phòng') ? (
                    <Building2 className="w-4 h-4" />
                  ) : (
                    <Home className="w-4 h-4" />
                  )}
                </div>
                <h3 className="font-bold text-sm text-white">{addr.title}</h3>
                {addr.isDefault && (
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-extrabold uppercase">
                    Địa Chỉ Mặc Định
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs">
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-cyan-400 hover:underline font-semibold"
                  >
                    Đặt làm mặc định
                  </button>
                )}
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa</span>
                </button>
              </div>
            </div>

            <div className="pt-3 space-y-1.5 text-xs">
              <div className="text-slate-200 font-semibold">
                Người nhận: <span className="text-white">{addr.recipientName}</span> • SĐT: <span className="text-cyan-300 font-mono">{addr.phoneNumber}</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">{addr.fullAddress}</p>
              {addr.note && (
                <div className="p-2 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-cyan-300 text-[11px] mt-2">
                  ★ {addr.note}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100 text-xs space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Thêm Địa Chỉ Giao Nhận Mới
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="text-slate-400">Tên gợi nhớ (Ví dụ: Nhà riêng, Biệt thự, Văn phòng)</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400">Họ và tên người nhận</label>
                <input
                  type="text"
                  required
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400">Số điện thoại liên hệ</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400">Địa chỉ chi tiết (Số nhà, đường, phường, quận, TP)</label>
                <textarea
                  rows={2}
                  required
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400">Ghi chú giao hàng hoặc lắp trạm sạc</label>
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Ví dụ: Đã có nguồn điện 3 pha 380V..."
                  className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold shadow-lg shadow-cyan-500/20"
                >
                  Lưu Địa Chỉ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};