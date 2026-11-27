import type { SpecGroup, SpecRow, VehicleComparisonTrim } from '@/features/customer/types/comparison.types';

export const getCellValue = (
  row: SpecRow,
  trim: VehicleComparisonTrim,
  trimIndex: number
): string => {
  const trimKey = String(trim.id);
  return (
    row.values?.[trimKey] ??
    (trimIndex === 0
      ? row.standardVal
      : trimIndex === 1
        ? row.performanceVal
        : row.trackVal) ??
    '—'
  );
};

export const getCellSubValue = (
  row: SpecRow,
  trim: VehicleComparisonTrim,
  trimIndex: number
): string => {
  const trimKey = String(trim.id);
  return (
    row.subValues?.[trimKey] ??
    (trimIndex === 0
      ? row.standardSub
      : trimIndex === 1
        ? row.performanceSub
        : row.trackSub) ??
    ''
  );
};

type CompareDirection = 'higher' | 'lower' | null;

const getRowCompareDirection = (row: SpecRow): CompareDirection => {
  const text = `${row.id} ${row.label} ${row.unit || ''}`.toLowerCase();

  // Multi-dimension or purely descriptive rows should not be ranked numerically
  if (text.includes('dài x rộng x cao') || text.includes('động cơ') || text.includes('treo')) {
    return null;
  }

  if (
    text.includes('tăng tốc') ||
    text.includes('0 - 100') ||
    text.includes('0-100') ||
    text.includes('trọng lượng') ||
    text.includes('khối lượng') ||
    text.includes('sạc') ||
    text.includes('tiêu hao') ||
    text.includes('giây')
  ) {
    return 'lower';
  }

  if (
    text.includes('công suất') ||
    text.includes('mô-men') ||
    text.includes('tốc độ') ||
    text.includes('quãng đường') ||
    text.includes('phạm vi') ||
    text.includes('chiều dài cơ sở') ||
    text.includes('dung tích') ||
    text.includes('khoang hành lý') ||
    text.includes('âm thanh') ||
    text.includes('loa') ||
    text.includes('la-zăng') ||
    text.includes('mâm')
  ) {
    return 'higher';
  }

  return null;
};

const parsePrimaryNumber = (raw: string, row: SpecRow): number | null => {
  if (!raw || raw === '—') return null;

  // For charging strings like "10 - 80% trong 15 phút", extract the minutes
  const minuteMatch = raw.match(/(\d+(?:[.,]\d+)?)\s*phút/i);
  if (minuteMatch) {
    return Number(minuteMatch[1].replace(',', '.'));
  }

  // Extract first numeric token (handling Vietnamese thousand dots like 1.020 or 2.990)
  const match = raw.match(/\d+(?:[.,]\d+)*/);
  if (!match) return null;

  const token = match[0];
  if (/^\d{1,3}(\.\d{3})+$/.test(token)) {
    return Number(token.replace(/\./g, ''));
  }

  const normalized = Number(token.replace(',', '.'));
  if (Number.isNaN(normalized)) return null;

  // If unit is explicitly kW or similar fallback, value is still comparable within the same row
  void row;
  return normalized;
};

/**
 * Returns the set of trim IDs that have the best numeric value for a given spec row.
 */
export const getWinningTrimIdsForRow = (
  row: SpecRow,
  trims: VehicleComparisonTrim[]
): Set<string> => {
  const winners = new Set<string>();
  const isDifferent = Boolean(row.isDifferent ?? (row as { different?: boolean }).different);
  if (!isDifferent || trims.length < 2) return winners;

  const direction = getRowCompareDirection(row);
  if (!direction) return winners;

  const parsed: Array<{ trimId: string; value: number }> = [];
  for (let i = 0; i < trims.length; i++) {
    const raw = getCellValue(row, trims[i], i);
    const num = parsePrimaryNumber(raw, row);
    if (num !== null) {
      parsed.push({ trimId: String(trims[i].id), value: num });
    }
  }

  if (parsed.length < 2) return winners;

  const values = parsed.map((p) => p.value);
  const bestValue = direction === 'lower' ? Math.min(...values) : Math.max(...values);
  const worstValue = direction === 'lower' ? Math.max(...values) : Math.min(...values);

  if (bestValue === worstValue) return winners;

  for (const item of parsed) {
    if (item.value === bestValue) {
      winners.add(item.trimId);
    }
  }

  return winners;
};

/**
 * Computes which trim leads across the compared specs and assigns the "KHUYÊN DÙNG" badge dynamically.
 */
export const applyRecommendedTrim = (
  trims: VehicleComparisonTrim[],
  specGroups: SpecGroup[]
): VehicleComparisonTrim[] => {
  if (trims.length === 0) return trims;

  const scores = new Map<string, number>();
  for (const trim of trims) {
    scores.set(String(trim.id), 0);
  }

  for (const group of specGroups) {
    for (const row of group.rows) {
      const winners = getWinningTrimIdsForRow(row, trims);
      for (const id of winners) {
        scores.set(id, (scores.get(id) ?? 0) + 1);
      }
    }
  }

  let bestTrimId = String(trims[0].id);
  let bestScore = -1;
  let bestPrice = trims[0].price;

  for (const trim of trims) {
    const id = String(trim.id);
    const score = scores.get(id) ?? 0;
    if (score > bestScore || (score === bestScore && trim.price < bestPrice)) {
      bestScore = score;
      bestTrimId = id;
      bestPrice = trim.price;
    }
  }

  if (bestScore <= 0) {
    return trims;
  }

  return trims.map((trim) => {
    const isBest = String(trim.id) === bestTrimId;
    if (isBest) {
      return {
        ...trim,
        badge: 'KHUYÊN DÙNG',
        badgeVariant: 'accent',
      };
    }

    return {
      ...trim,
      badge: trim.badge === 'KHUYÊN DÙNG' ? undefined : trim.badge,
      badgeVariant: trim.badgeVariant === 'accent' ? 'default' : trim.badgeVariant,
    };
  });
};
