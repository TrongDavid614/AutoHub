import React, { useState } from 'react';
import {
  Search,
  Phone,
  Mail,
  Sparkles,
  ChevronRight,
  X,
  History,
  Send,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import { MOCK_CONSULTATION_LEADS, type ConsultationLead } from '@/features/staff-operations/mocks/staff.mock';
import { cn } from '@/lib/utils';

export const ConsultationListPage: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [activeTab, setActiveTab] = useState<'PENDING' | 'CONTACTED' | 'CLOSED'>('PENDING');
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<ConsultationLead | null>(null);
  const [callNotes, setCallNotes] = useState('');
  const [leads, setLeads] = useState<ConsultationLead[]>(MOCK_CONSULTATION_LEADS);

  const filteredLeads = leads.filter((lead) => {
    const matchTab = lead.status === activeTab;
    const matchSearch =
      lead.customerName.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search) ||
      lead.interestedCar.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleUpdateStatus = (leadId: string, newStatus: 'PENDING' | 'CONTACTED' | 'CLOSED') => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  const handleAddCallNote = () => {
    if (!callNotes.trim() || !selectedLead) return;
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
            Tiếp Nhận & Xử Lý Yêu Cầu Tư Vấn Khách Hàng
          </h1>
          <p className={cn('text-sm mt-0.5', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
            Tích hợp nhật ký tương tác NhatKyHanhVi (Dwell Time, 360°, Dự toán lăn bánh) và Chân dung AI Persona gợi ý kịch bản mở đầu cuộc gọi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              'px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5',
              isDarkMode
                ? 'bg-[#171F33] border-[#3E4850]/50 text-[#89CEFF]'
                : 'bg-sky-50 border-sky-200 text-sky-700'
            )}
          >
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>AI Persona Active</span>
          </span>
        </div>
      </div>

      {/* 2. Tabs Filter & Search Bar */}
      <div
        className={cn(
          'p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors',
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-sm'
            : 'bg-white border-slate-200 shadow-xs'
        )}
      >
        {/* Tabs */}
        <div className="flex items-center gap-2">
          {[
            { id: 'PENDING', label: 'Chờ Tiếp Nhận', count: leads.filter((l) => l.status === 'PENDING').length },
            { id: 'CONTACTED', label: 'Đang Chăm Sóc', count: leads.filter((l) => l.status === 'CONTACTED').length },
            { id: 'CLOSED', label: 'Đã Hoàn Tất', count: leads.filter((l) => l.status === 'CLOSED').length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
                activeTab === tab.id
                  ? isDarkMode
                    ? 'bg-[#171F33] text-[#89CEFF] border border-[#89CEFF]/30 shadow-xs'
                    : 'bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs'
                  : isDarkMode
                  ? 'text-[#88929B] hover:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  'text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold',
                  activeTab === tab.id
                    ? isDarkMode
                      ? 'bg-blue-500/20 text-[#89CEFF]'
                      : 'bg-blue-600 text-white'
                    : isDarkMode
                    ? 'bg-[#131B2E] text-[#88929B]'
                    : 'bg-slate-200 text-slate-600'
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search
            className={cn(
              'w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2',
              isDarkMode ? 'text-[#88929B]' : 'text-slate-400'
            )}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên khách, SĐT, xe..."
            className={cn(
              'w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border outline-none transition-colors',
              isDarkMode
                ? 'bg-[#131B2E] border-[#3E4850]/50 text-white placeholder-[#88929B] focus:border-[#89CEFF]'
                : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500'
            )}
          />
        </div>
      </div>

      {/* 3. Leads Data Table (<Datagrid>) */}
      <div
        className={cn(
          'rounded-xl border overflow-hidden transition-colors',
          isDarkMode
            ? 'bg-[#0B1326] border-[#3E4850]/40 shadow-lg'
            : 'bg-white border-slate-200 shadow-sm'
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className={cn(
                'font-mono uppercase text-[11px] border-b',
                isDarkMode ? 'bg-[#131B2E] text-[#88929B] border-[#3E4850]/40' : 'bg-slate-50 text-slate-500 border-slate-200'
              )}
            >
              <tr>
                <th className="py-3 px-4">Thời Điểm</th>
                <th className="py-3 px-4">Khách Hàng & SĐT</th>
                <th className="py-3 px-4">Dòng Xe Quan Tâm</th>
                <th className="py-3 px-4">Khung Giờ Tiện Nghe</th>
                <th className="py-3 px-4">Nhân Viên Phụ Trách</th>
                <th className="py-3 px-4 text-center">Trạng Thái</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className={cn('divide-y font-sans', isDarkMode ? 'divide-[#3E4850]/30' : 'divide-slate-100')}>
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className={cn(
                    'transition-colors',
                    isDarkMode ? 'hover:bg-[#131B2E]/60' : 'hover:bg-slate-50'
                  )}
                >
                  <td className={cn('py-3 px-4 font-mono text-[11px]', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>
                    {lead.createdAt}
                  </td>
                  <td className="py-3 px-4">
                    <div className={cn('font-semibold', isDarkMode ? 'text-white' : 'text-slate-900')}>{lead.customerName}</div>
                    <div className={cn('text-[11px] font-mono', isDarkMode ? 'text-[#88929B]' : 'text-slate-500')}>{lead.phone}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className={cn('font-medium', isDarkMode ? 'text-white' : 'text-slate-800')}>{lead.interestedCar}</div>
                    <div className={cn('text-[10px]', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>{lead.email}</div>
                  </td>
                  <td className={cn('py-3 px-4 text-[11px]', isDarkMode ? 'text-[#88929B]' : 'text-slate-600')}>{lead.preferredTime}</td>
                  <td className="py-3 px-4">
                    <span className={cn('font-medium text-xs', isDarkMode ? 'text-white' : 'text-slate-800')}>{lead.assignedStaff}</span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                        lead.status === 'PENDING' &&
                          (isDarkMode
                            ? 'bg-red-950/70 text-red-300 border border-red-800/40'
                            : 'bg-red-50 text-red-700 border border-red-200'),
                        lead.status === 'CONTACTED' &&
                          (isDarkMode
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'),
                        lead.status === 'CLOSED' &&
                          (isDarkMode
                            ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/40'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200')
                      )}
                    >
                      {lead.status === 'PENDING' ? 'Chờ Tiếp Nhận' : lead.status === 'CONTACTED' ? 'Đang Chăm Sóc' : 'Đã Hoàn Tất'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedLead(lead)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer inline-flex items-center gap-1 shadow-sm"
                    >
                      <span>Hồ Sơ AI</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Ngăn kéo Hồ sơ tư vấn thông minh (<ConsultationSheet> 580px) */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
          <div
            className={cn(
              'w-full max-w-2xl h-full overflow-y-auto border-l p-6 space-y-6 shadow-2xl transition-colors',
              isDarkMode ? 'bg-[#0B1326] border-[#3E4850] text-[#DAE2FD]' : 'bg-white border-slate-200 text-slate-800'
            )}
          >
            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#3E4850]/40">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-blue-500 uppercase font-bold">Hồ Sơ Tư Vấn & Chân Dung AI</span>
                <h3 className={cn('text-base font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                  {selectedLead.customerName} - {selectedLead.phone}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className={cn('p-1.5 rounded-lg border cursor-pointer', isDarkMode ? 'border-[#3E4850]/50 hover:bg-[#131B2E]' : 'border-slate-200 hover:bg-slate-100')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Section 1: Customer Contact Info */}
            <div className={cn('p-4 rounded-xl border space-y-2', isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40' : 'bg-slate-50 border-slate-200')}>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className={cn('block text-[10px] font-mono uppercase', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>Dòng xe quan tâm</span>
                  <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{selectedLead.interestedCar}</strong>
                </div>
                <div>
                  <span className={cn('block text-[10px] font-mono uppercase', isDarkMode ? 'text-[#88929B]' : 'text-slate-400')}>Khung giờ tiện nghe máy</span>
                  <span className="font-mono">{selectedLead.preferredTime}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-2 text-xs font-mono">
                <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-1.5 text-blue-500 hover:underline">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{selectedLead.phone}</span>
                </a>
                <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-1.5 text-blue-500 hover:underline">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{selectedLead.email}</span>
                </a>
              </div>
            </div>

            {/* Section 2: User Tracking Timeline (<UserJourneyTimeline>) */}
            <div className={cn('p-4 rounded-xl border space-y-3', isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40' : 'bg-slate-50 border-slate-200')}>
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-blue-500" />
                <h4 className={cn('text-xs font-bold uppercase tracking-wider font-mono', isDarkMode ? 'text-white' : 'text-slate-900')}>
                  Dòng Thời Gian Tương Tác Thực Tế (NhatKyHanhVi)
                </h4>
              </div>

              <div className="space-y-2.5 pt-1">
                {selectedLead.userJourney.map((journey, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs">
                    <span className="font-mono text-[11px] text-blue-500 font-bold flex-shrink-0 mt-0.5">
                      [{journey.time}]
                    </span>
                    <div className="space-y-0.5">
                      <div className={isDarkMode ? 'text-white' : 'text-slate-800'}>{journey.detail}</div>
                      {journey.dwellTime && (
                        <div className="text-[10px] font-mono text-emerald-500 font-bold">
                          Dwell Time: {journey.dwellTime}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: AI Persona Insights (<AIPersonaCard>) */}
            <div className={cn('p-4 rounded-xl border space-y-3', isDarkMode ? 'bg-[#101F38] border-blue-500/40 text-blue-100' : 'bg-sky-50 border-sky-300 text-slate-800')}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-blue-600 dark:text-[#89CEFF]">
                  Chân Dung Khách Hàng Do AI Gemini & Vector DB Tổng Hợp
                </h4>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold text-blue-500">Nhóm khách hàng:</span>
                  <div className="font-semibold">{selectedLead.aiPersona.personaGroup}</div>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold text-blue-500">Mức độ sẵn sàng tài chính:</span>
                  <div>{selectedLead.aiPersona.financialReadiness}</div>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase font-bold text-blue-500">Mối quan tâm cốt lõi:</span>
                  <div>{selectedLead.aiPersona.primaryConcern}</div>
                </div>

                <div className={cn('p-3 rounded-lg border space-y-1 mt-2', isDarkMode ? 'bg-[#0B1326] border-blue-500/30' : 'bg-white border-sky-200')}>
                  <span className="text-[10px] font-mono uppercase font-bold text-emerald-500">Kịch bản mở đầu cuộc gọi gợi ý:</span>
                  <p className="text-[11px] italic leading-relaxed">{selectedLead.aiPersona.suggestedPitch}</p>
                </div>
              </div>
            </div>

            {/* Section 4: Call Notes & Status Update */}
            <div className="space-y-3 pt-2">
              <label className={cn('text-xs block font-bold', isDarkMode ? 'text-white' : 'text-slate-900')}>
                Ghi Chú Cuộc Gọi & Cập Nhật Trạng Thái:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Ghi nhanh nội dung trao đổi với khách..."
                  className={cn(
                    'flex-1 px-3 py-2 text-xs rounded-lg border outline-none',
                    isDarkMode
                      ? 'bg-[#131B2E] border-[#3E4850]/50 text-white placeholder-[#88929B] focus:border-[#89CEFF]'
                      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500'
                  )}
                />
                <button
                  type="button"
                  onClick={handleAddCallNote}
                  className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Lưu</span>
                </button>
              </div>

              {selectedLead.notes && (
                <div className={cn('p-3 rounded-lg border text-xs whitespace-pre-line', isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/40' : 'bg-slate-50 border-slate-200')}>
                  {selectedLead.notes}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedLead.id, 'CONTACTED')}
                  className="flex-1 py-2 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-700 dark:text-amber-400 text-xs font-bold cursor-pointer hover:bg-amber-500/25 transition-colors"
                >
                  Đang Chăm Sóc
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedLead.id, 'CLOSED')}
                  className="flex-1 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold cursor-pointer hover:bg-emerald-500/25 transition-colors"
                >
                  Đã Hoàn Tất Chốt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
