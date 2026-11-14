import React, { useState } from 'react';
import {
  Bot,
  Send,
  X,
  Sparkles,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Clock,
  ShieldAlert,
  ThumbsUp,
} from 'lucide-react';
import { useAdminTheme } from '@/context/AdminThemeContext';
import {
  adminAiService,
  type AdminAiCopilotResponse,
  type ReviewSentimentAnalysisResponse,
} from '../services/admin-ai.service';

export const AdminAiCopilotDrawer: React.FC = () => {
  const { isDarkMode } = useAdminTheme();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<'COPILOT' | 'SENTIMENT'>('COPILOT');
  const [query, setQuery] = useState<string>('');
  const [reviewContent, setReviewContent] = useState<string>('');
  const [copilotLoading, setCopilotLoading] = useState<boolean>(false);
  const [copilotResult, setCopilotResult] = useState<AdminAiCopilotResponse | null>(null);
  const [sentimentLoading, setSentimentLoading] = useState<boolean>(false);
  const [sentimentResult, setSentimentResult] = useState<ReviewSentimentAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleQueries = [
    'Quy định giải ngân hoàn cọc xe 72h khi ngân hàng từ chối vay?',
    'Quy tắc BR06 tự động giải phóng xe hết hạn cọc như thế nào?',
    'Chính sách bảo hành và đổi trả phụ kiện chính hãng?',
  ];

  const handleAskCopilot = async (overrideQuery?: string) => {
    const textToQuery = overrideQuery || query;
    if (!textToQuery.trim()) return;

    setCopilotLoading(true);
    setError(null);
    try {
      const res = await adminAiService.askCopilot(textToQuery.trim());
      setCopilotResult(res);
    } catch (err) {
      console.error('Failed to ask AI Copilot:', err);
      setError('Không thể kết nối đến Trợ lý AI Copilot. Vui lòng kiểm tra lại cấu hình.');
    } finally {
      setCopilotLoading(false);
    }
  };

  const handleAnalyzeSentiment = async () => {
    if (!reviewContent.trim()) return;

    setSentimentLoading(true);
    setError(null);
    try {
      const res = await adminAiService.analyzeReview(reviewContent.trim());
      setSentimentResult(res);
    } catch (err) {
      console.error('Failed to analyze sentiment:', err);
      setError('Không thể phân tích ngữ nghĩa nội dung nhận xét. Vui lòng thử lại.');
    } finally {
      setSentimentLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        title="Mở Trợ lý Quản trị Admin AI Copilot"
      >
        <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
        <span>Admin AI Copilot</span>
      </button>

      {/* Drawer Overlay & Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
          <div
            className={`w-full max-w-md h-full flex flex-col shadow-2xl transition-all duration-300 border-l ${
              isDarkMode
                ? 'bg-[#0B1326] text-[#DAE2FD] border-[#3E4850]/40'
                : 'bg-white text-slate-800 border-slate-200'
            }`}
          >
            {/* Header */}
            <div className={`p-4 border-b flex items-center justify-between ${
              isDarkMode ? 'border-[#3E4850]/40 bg-[#131B2E]' : 'border-slate-100 bg-slate-50'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-600 text-white shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`text-sm font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    AutoHub AI Copilot
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      RAG
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Trợ lý nghiệp vụ & phân tích thông minh cho Quản trị viên</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setMode('COPILOT'); setError(null); }}
                className={`flex-1 py-2.5 text-center transition-colors border-b-2 cursor-pointer ${
                  mode === 'COPILOT'
                    ? 'border-blue-600 text-blue-600 dark:text-[#89CEFF]'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Hỏi đáp Quy chế & Nghiệp vụ
              </button>
              <button
                type="button"
                onClick={() => { setMode('SENTIMENT'); setError(null); }}
                className={`flex-1 py-2.5 text-center transition-colors border-b-2 cursor-pointer ${
                  mode === 'SENTIMENT'
                    ? 'border-purple-600 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Phân tích Đánh giá Khách
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p>{error}</p>
                    <button
                      type="button"
                      onClick={() => mode === 'COPILOT' ? handleAskCopilot() : handleAnalyzeSentiment()}
                      className="mt-1 font-bold underline cursor-pointer"
                    >
                      Thử lại
                    </button>
                  </div>
                </div>
              )}

              {mode === 'COPILOT' ? (
                <>
                  {/* Sample suggestions */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Câu hỏi gợi ý:</span>
                    </div>
                    <div className="space-y-1">
                      {sampleQueries.map((q, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setQuery(q);
                            handleAskCopilot(q);
                          }}
                          className={`w-full text-left p-2 rounded-lg border text-[11px] transition-colors cursor-pointer ${
                            isDarkMode
                              ? 'bg-[#131B2E]/60 border-[#3E4850]/40 hover:bg-[#131B2E] text-[#DAE2FD]'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          "{q}"
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Result view */}
                  {copilotLoading ? (
                    <div className="p-4 rounded-xl border border-dashed border-blue-500/40 bg-blue-500/5 space-y-2 animate-pulse">
                      <div className="flex items-center gap-2 text-blue-500 font-semibold text-xs">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>AI đang tra cứu tài liệu quy chế đại lý...</span>
                      </div>
                      <div className="h-3 bg-blue-200 dark:bg-blue-900/40 rounded w-full" />
                      <div className="h-3 bg-blue-200 dark:bg-blue-900/40 rounded w-4/5" />
                    </div>
                  ) : copilotResult ? (
                    <div className={`p-4 rounded-xl border space-y-3 ${
                      isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/50' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-blue-500 flex items-center gap-1">
                          <Bot className="w-3.5 h-3.5" />
                          Câu trả lời từ Copilot
                        </span>
                        <span className="font-mono text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {copilotResult.responseTimeMs} ms
                        </span>
                      </div>
                      <p className="leading-relaxed text-slate-700 dark:text-slate-200 font-medium">
                        {copilotResult.answer}
                      </p>
                      {copilotResult.sources && copilotResult.sources.length > 0 && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Nguồn trích xuất:</span>
                          <ul className="list-disc list-inside text-[11px] text-slate-500 dark:text-slate-400">
                            {copilotResult.sources.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : null}
                </>
              ) : (
                /* Sentiment Mode */
                <>
                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold text-slate-400">
                      Dán nội dung nhận xét của khách hàng để phân tích cảm xúc & phát hiện vi phạm:
                    </label>
                    <textarea
                      rows={4}
                      value={reviewContent}
                      onChange={(e) => setReviewContent(e.target.value)}
                      placeholder="Ví dụ: Dịch vụ hỗ trợ rất nhiệt tình, xe giao đúng hẹn... hoặc: Hàng lừa đảo, cực kỳ tệ hại..."
                      className={`w-full p-2.5 rounded-lg border text-xs outline-none transition-colors ${
                        isDarkMode
                          ? 'bg-[#131B2E] border-[#3E4850]/50 text-white focus:border-purple-500'
                          : 'bg-white border-slate-300 text-slate-900 focus:border-purple-600'
                      }`}
                    />
                    <button
                      type="button"
                      disabled={sentimentLoading || !reviewContent.trim()}
                      onClick={handleAnalyzeSentiment}
                      className="w-full py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {sentimentLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>Phân tích ngữ nghĩa</span>
                    </button>
                  </div>

                  {sentimentResult && (
                    <div className={`p-4 rounded-xl border space-y-3 ${
                      isDarkMode ? 'bg-[#131B2E] border-[#3E4850]/50' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold flex items-center gap-1.5">
                          {sentimentResult.isToxic ? (
                            <ShieldAlert className="w-4 h-4 text-red-500" />
                          ) : (
                            <ThumbsUp className="w-4 h-4 text-emerald-500" />
                          )}
                          Kết quả đánh giá
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          sentimentResult.recommendation === 'APPROVE'
                            ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                            : 'bg-red-500/15 text-red-500 border border-red-500/30'
                        }`}>
                          Khuyến nghị: {sentimentResult.recommendation}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="p-2 rounded bg-black/10 dark:bg-black/30">
                          <span className="text-slate-400 block text-[10px]">Cảm xúc:</span>
                          <span className="font-bold uppercase">{sentimentResult.sentiment}</span>
                        </div>
                        <div className="p-2 rounded bg-black/10 dark:bg-black/30">
                          <span className="text-slate-400 block text-[10px]">Độ tin cậy:</span>
                          <span className="font-bold">{(sentimentResult.confidenceScore * 100).toFixed(0)}%</span>
                        </div>
                      </div>

                      {sentimentResult.isToxic && (
                        <div className="p-2.5 rounded bg-red-500/10 border border-red-500/30 text-red-500 text-[11px]">
                          Phát hiện yếu tố nhạy cảm / xúc phạm. Hệ thống khuyến nghị từ chối hiển thị công khai.
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Bottom Input (For Copilot Mode) */}
            {mode === 'COPILOT' && (
              <div className={`p-3 border-t flex items-center gap-2 ${
                isDarkMode ? 'border-[#3E4850]/40 bg-[#131B2E]' : 'border-slate-200 bg-slate-50'
              }`}>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAskCopilot();
                  }}
                  placeholder="Nhập câu hỏi nghiệp vụ..."
                  className={`flex-1 px-3 py-2 rounded-lg border text-xs outline-none transition-colors ${
                    isDarkMode
                      ? 'bg-[#0B1326] border-[#3E4850]/50 text-white focus:border-blue-500'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600'
                  }`}
                />
                <button
                  type="button"
                  disabled={copilotLoading || !query.trim()}
                  onClick={() => handleAskCopilot()}
                  className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer disabled:opacity-50"
                  title="Gửi câu hỏi"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
