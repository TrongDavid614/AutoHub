import { useState } from 'react';

export type TrimType = 'standard' | 'performance' | 'track';
export type ViewTab = 'exterior' | 'interior' | 'detail';

export interface TrimSpec {
  name: string;
  hp: string;
  range: string;
  price: number;
  priceFormatted: string;
  installment: string;
  acceleration: string;
  battery: string;
}

export const TRIM_DATA: Record<TrimType, TrimSpec> = {
  standard: {
    name: 'Standard GT',
    hp: '520 HP',
    range: '580 km • RWD Dual Mode',
    price: 2490000000,
    priceFormatted: '2.490.000.000',
    installment: 'từ 25.000.000 đ/tháng',
    acceleration: '4.1',
    battery: '90 kWh',
  },
  performance: {
    name: 'GT-e Performance',
    hp: '680 HP',
    range: '680 km • Dual Motor AWD',
    price: 2890000000,
    priceFormatted: '2.890.000.000',
    installment: 'từ 29.500.000 đ/tháng',
    acceleration: '3.2',
    battery: '105 kWh',
  },
  track: {
    name: 'Track Edition RS',
    hp: '1.020 HP',
    range: '600 km • Tri-Motor Vectoring',
    price: 3490000000,
    priceFormatted: '3.490.000.000',
    installment: 'từ 35.000.000 đ/tháng',
    acceleration: '2.8',
    battery: '112 kWh',
  },
};

export const useCarDetail = () => {
  const [activeTrim, setActiveTrim] = useState<TrimType>('performance');
  const [activeColor, setActiveColor] = useState<string>('silver');
  const [activeViewAngle, setActiveViewAngle] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<ViewTab>('exterior');

  const [isDepositOpen, setIsDepositOpen] = useState<boolean>(false);
  const [isTestDriveOpen, setIsTestDriveOpen] = useState<boolean>(false);

  const currentTrimData = TRIM_DATA[activeTrim];

  return {
    activeTrim,
    setActiveTrim,
    activeColor,
    setActiveColor,
    activeViewAngle,
    setActiveViewAngle,
    activeTab,
    setActiveTab,
    isDepositOpen,
    setIsDepositOpen,
    isTestDriveOpen,
    setIsTestDriveOpen,
    trimData: TRIM_DATA,
    currentTrimData,
  };
};
