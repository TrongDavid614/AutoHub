export interface CarColorOption {
  id: string;
  name: string;
  hex: string;
}

export const EXTERIOR_COLORS: CarColorOption[] = [
  { id: 'silver', name: 'Bạc Ánh Kim Apex Silver', hex: '#CBD5E1' },
  { id: 'black', name: 'Đen Huyền Bí Obsidian Black', hex: '#0F172A' },
  { id: 'white', name: 'Trắng Băng Bắc Cực Arctic White', hex: '#FFFFFF' },
  { id: 'blue', name: 'Xanh Công Nghệ Hyper Tech Blue', hex: '#0284C7' },
  { id: 'grey', name: 'Xám Titan Nardo Grey', hex: '#475569' },
];
