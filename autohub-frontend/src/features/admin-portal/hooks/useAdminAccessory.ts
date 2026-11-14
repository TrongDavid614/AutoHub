import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  adminAccessoryService,
  type AdminAccessoryItem,
  type AccessoryCategoryItem,
  type CreateAccessoryPayload,
  type UpdateAccessoryPayload,
} from '../services/admin-accessory.service';

export function useAdminAccessory() {
  const [accessories, setAccessories] = useState<AdminAccessoryItem[]>([]);
  const [categories, setCategories] = useState<AccessoryCategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [lowStockOnly, setLowStockOnly] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [accData, catData] = await Promise.all([
        adminAccessoryService.getAccessories({
          search: search.trim() || undefined,
          categoryId: selectedCategory,
          lowStock: lowStockOnly || undefined,
        }),
        adminAccessoryService.getCategories(),
      ]);
      setAccessories(accData || []);
      setCategories(catData || []);
    } catch (err) {
      console.error('Failed to fetch accessories:', err);
      setError('Không thể tải dữ liệu phụ kiện từ máy chủ.');
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, lowStockOnly]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleStatus = async (id: number) => {
    try {
      const newStatus = await adminAccessoryService.toggleStatus(id);
      setAccessories((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                isActive: newStatus,
                status: !newStatus
                  ? 'Đã tạm ẩn'
                  : item.stock === 0
                  ? 'Hết hàng'
                  : item.stock <= item.minThreshold
                  ? 'Sắp hết hàng'
                  : 'Còn hàng',
              }
            : item
        )
      );
    } catch (err) {
      console.error('Failed to toggle status:', err);
      throw err;
    }
  };

  const createAccessory = async (payload: CreateAccessoryPayload) => {
    const newItem = await adminAccessoryService.createAccessory(payload);
    setAccessories((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updateAccessory = async (id: number, payload: UpdateAccessoryPayload) => {
    const updated = await adminAccessoryService.updateAccessory(id, payload);
    setAccessories((prev) => prev.map((item) => (item.id === id ? updated : item)));
    return updated;
  };

  const stats = useMemo(() => {
    const total = accessories.length;
    const lowStock = accessories.filter((a) => a.stock <= a.minThreshold && a.stock > 0).length;
    const outOfStock = accessories.filter((a) => a.stock === 0).length;
    const active = accessories.filter((a) => a.isActive).length;
    return { total, lowStock, outOfStock, active };
  }, [accessories]);

  return {
    accessories,
    categories,
    loading,
    error,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    lowStockOnly,
    setLowStockOnly,
    fetchData,
    toggleStatus,
    createAccessory,
    updateAccessory,
    stats,
  };
}
