import React, { useState, useEffect } from 'react';
import {
  Search,
  ChevronRight,
  X,
  Send,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { staffService } from '@/features/staff-operations/services/staff.service';
import type { ConsultationLead } from '@/types/staff.types';
import { cn } from '@/lib/utils';

export const ConsultationListPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [activeTab, setActiveTab] = useState<'PENDING' | 'CONTACTED' | 'CLOSED'>('PENDING');
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<ConsultationLead | null>(null);
  const [callNotes, setCallNotes] = useState('');
  const [leads, setLeads] = useState<ConsultationLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const data = await staffService.getConsultations();
      setLeads(data);
    } catch (err) {
      console.error('Lỗi tải danh sách yêu cầu tư vấn:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    fetchLeads();
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const matchTab = lead.status === activeTab;
    const matchSearch =
      lead.customerName.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search) ||
      lead.interestedCar.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleUpdateStatus = async (leadId: string, newStatus: 'PENDING' | 'CONTACTED' | 'CLOSED') => {
    try {
      await staffService.updateConsultationStatus(leadId, newStatus);
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      );
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (err) {
      console.error('Lỗi cập nhật trạng thái:', err);
    }
  };

  const handleAddCallNote = async () => {
    if (!callNotes.trim() || !selectedLead) return;
    try {
      await staffService.addConsultationNote(selectedLead.id, callNotes);
      const updated = {
        ...selectedLead,
        notes: selectedLead.notes
          ? `${selectedLead.notes}\n• [Hôm nay]: ${callNotes}`
          : `• [Hôm nay]: ${callNotes}`,
        status: 'CONTACTED' as const,
      };
      setSelectedLead(updated);
      setLeads((prev) => prev.map((l) => (l.id === selectedLead.id ? updated : l)));
      setCallNotes('');
    } catch (err) {
      console.error('Lỗi lưu nhật ký cuộc gọi:', err);
    }
  };

  return (
    <div
      className={cn(
        'space-y-6 antialiased transition-colors duration-300',
        isDarkMode ? 'text-[#DAE2FD]' : 'text-slate-800'
      )}
    >
      {/* 1. Header Toolbar */}
      <div
        className={cn(
          'flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border transition-colors',
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
            : 'bg-white border-slate-200 shadow-sm'
        )}
      >
        <div>
          <h1 className={cn('text-xl md:text-2xl font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
            Tiếp Nhận & Xử Lý Yêu Cầu Tư Vấn Khách Hàng (CRM)
          </h1>
          <p className={cn('text-sm mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Dữ liệu trực tiếp từ SQL Server: Phân bổ Lead theo thời gian thực, lưu nhật ký cuộc gọi và ghi nhận nhu cầu xe.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            className={cn(
              'px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors',
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/50 hover:bg-[#1C2640] text-slate-200'
                : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
            )}
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isLoading && 'animate-spin')} />
            Làm mới
          </button>
          <div className="flex bg-slate-100 dark:bg-[#131B2E] p-1 rounded-xl border border-slate-200 dark:border-[#3E4850]/40">
            {(['PENDING', 'CONTACTED', 'CLOSED'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-xs'
                    : isDarkMode
                      ? 'text-[#88929B] hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {tab === 'PENDING' && 'Mới Nhận'}
                {tab === 'CONTACTED' && 'Đang Tư Vấn'}
                {tab === 'CLOSED' && 'Đã Hoàn Tất'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Search Bar */}
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm theo tên khách, SĐT hoặc mẫu xe quan tâm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn(
            'w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-500',
            isDarkMode
              ? 'bg-[#0B1326] border-[#3E4850]/40 text-white placeholder-[#88929B]'
              : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
          )}
        />
      </div>

      {/* 3. Lead Cards Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-xs font-mono text-slate-400">Đang tải danh sách tư vấn từ cơ sở dữ liệu...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className={cn('p-12 text-center rounded-xl border text-sm font-mono', isDarkMode ? 'bg-[#0B1326] border-[#3E4850]/40 text-slate-400' : 'bg-white border-slate-200 text-slate-500')}>
          Không có yêu cầu tư vấn nào ở trạng thái này.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className={cn(
                'p-5 rounded-xl border space-y-3 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between',
                isDarkMode
                  ? 'bg-[#0B1326] border-[#3E4850]/40 hover:border-blue-500/60'
                  : 'bg-white border-slate-200 hover:border-blue-300'
              )}
              onClick={() => setSelectedLead(lead)}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-[#89CEFF]">
                    {lead.interestedCar}
                  </span>
                  <span
                    className={cn(
                      'text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border',
                      lead.status === 'PENDING' && 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40',
                      lead.status === 'CONTACTED' && 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/40',
                      lead.status === 'CLOSED' && 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40'
                    )}
                  >
                    {lead.status === 'PENDING' ? 'MỚI NHẬN' : lead.status === 'CONTACTED' ? 'ĐANG TƯ VẤN' : 'HOÀN TẤT'}
                  </span>
                </div>

                <h3 className={cn('text-base font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                  {lead.customerName}
                </h3>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-1">
                  <span>{lead.phone}</span> • <span>{lead.preferredTime}</span>
                </div>

                <p className={cn('text-xs mt-3 line-clamp-2', isDarkMode ? 'text-[#88929B]' : 'text-slate-600')}>
                  {lead.notes}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#3E4850]/30 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>{lead.receivedAt || 'Hôm nay'}</span>
                <span className="text-blue-500 font-bold flex items-center gap-1">
                  Chi tiết <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. CRM Detail Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={cn('w-full max-w-xl p-6 rounded-2xl border space-y-4 shadow-2xl', isDarkMode ? 'bg-[#0B1326] border-[#3E4850]' : 'bg-white border-slate-200')}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#3E4850]/40">
              <div>
                <span className="text-[10px] uppercase font-mono text-blue-500 font-bold block">Nhật Ký Tư Vấn CRM</span>
                <h3 className={cn('text-base font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                  {selectedLead.customerName} • {selectedLead.interestedCar}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-lg border cursor-pointer border-slate-200 dark:border-[#3E4850]/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#131B2E] border border-slate-200 dark:border-[#3E4850]/40 font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">SỐ ĐIỆN THOẠI</span>
                  <strong>{selectedLead.phone}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">KHUNG GIỜ HẸN GỌI</span>
                  <strong>{selectedLead.preferredTime}</strong>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-400 text-[10px] uppercase block mb-1">Nhu Cầu Khách Hàng Ghi Nhận</span>
                <div className={cn('p-3 rounded-xl border leading-relaxed', isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40' : 'bg-slate-50 border-slate-200')}>
                  {selectedLead.notes}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-400 text-[10px] uppercase block mb-1">Thêm Nhật Ký Cuộc Gọi Mới</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ghi chú nội dung sau cuộc gọi..."
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCallNote()}
                    className={cn(
                      'flex-1 px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-blue-500',
                      isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/50 text-white' : 'bg-white border-slate-200'
                    )}
                  />
                  <button
                    type="button"
                    onClick={handleAddCallNote}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Gửi
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-[#3E4850]/40 flex items-center justify-between">
                <span className="font-mono text-[11px] text-slate-400">Trạng thái hiện tại:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedLead.id, 'CONTACTED')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 cursor-pointer"
                  >
                    Đang Tư Vấn
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedLead.id, 'CLOSED')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                  >
                    Chốt Thành Công
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
