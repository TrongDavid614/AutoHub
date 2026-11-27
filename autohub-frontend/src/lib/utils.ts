import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function formatDate(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Quy đổi số tiền thanh toán khi quét mã QR trong chế độ Sandbox Test Mode:
 * - Cọc xe: 20.000.000 ₫ -> 4.000 ₫ ; 10.000.000 ₫ -> 2.000 ₫ (chia 5000, làm tròn chẵn nghìn [2.000 - 10.000])
 * - Phụ kiện: scale theo bậc 500.000 ₫ để nằm trong khoảng [2.000 ₫ - 10.000 ₫]
 */
export function calculateTestPaymentAmount(originalAmount: number, isDeposit = true): number {
  if (!originalAmount || originalAmount <= 0) return 2000;
  if (isDeposit) {
    const reduced = Math.round(originalAmount / 5000);
    const rounded = Math.round(reduced / 1000) * 1000;
    return Math.min(10000, Math.max(2000, rounded));
  } else {
    const step = Math.floor(originalAmount / 500000) * 1000;
    const result = 2000 + step;
    return Math.min(10000, Math.max(2000, result));
  }
}

export function normalizeSearchText(text?: string | null): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLowerCase()
    .trim();
}

export function matchesSearchTerms(
  query: string,
  ...fields: Array<string | number | undefined | null>
): boolean {
  const q = normalizeSearchText(query);
  if (!q) return true;
  const tokens = q.split(/\s+/).filter(Boolean);
  const haystack = normalizeSearchText(
    fields.filter((f) => f !== undefined && f !== null).join(' ')
  );
  return tokens.every((token) => haystack.includes(token));
}

const parseIsoTimestampMs = (raw?: string | null): number | null => {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const normalized = trimmed.includes('T') ? trimmed : trimmed.replace(' ', 'T');
  const ms = Date.parse(normalized);
  return Number.isNaN(ms) ? null : ms;
};

/**
 * Computes remaining whole seconds until an ISO deadline timestamp using wall-clock time.
 */
export function getRemainingSeconds(
  deadlineIso?: string | null,
  nowMs: number = Date.now(),
  createdAtIso?: string | null,
  fallbackDurationSeconds = 0
): number {
  let targetMs = parseIsoTimestampMs(deadlineIso);

  if (targetMs === null && fallbackDurationSeconds > 0) {
    const createdMs = parseIsoTimestampMs(createdAtIso);
    if (createdMs !== null) {
      targetMs = createdMs + fallbackDurationSeconds * 1000;
    }
  }

  if (targetMs === null) return fallbackDurationSeconds;
  return Math.max(0, Math.floor((targetMs - nowMs) / 1000));
}
