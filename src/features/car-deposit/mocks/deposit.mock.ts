export interface DepositShowroom {
  id: string;
  name: string;
  address: string;
  city: string;
}

export const MOCK_DEPOSIT_SHOWROOMS: DepositShowroom[] = [
  {
    id: 'q7-hcm',
    name: 'Showroom Q7 TP.HCM',
    address: 'Tầng G, Crescent Mall, Đại lộ Nguyễn Văn Linh, P. Tân Phú, Q.7',
    city: 'TP. Hồ Chí Minh',
  },
  {
    id: 'l81-hcm',
    name: 'Showroom Landmark 81 TP.HCM',
    address: 'Khu Đô Thị Vinhomes Central Park, 720A Điện Biên Phủ, P.22, Bình Thạnh',
    city: 'TP. Hồ Chí Minh',
  },
  {
    id: 'hyperion-hn',
    name: 'Showroom Hyperion Hà Nội',
    address: 'Tòa nhà Hyperion Tower, 54 Liễu Giai, P. Cống Vị, Ba Đình',
    city: 'Hà Nội',
  },
];

export const FIXED_DEPOSIT_AMOUNT = 20_000_000;
export const DEPOSIT_HOLD_MINUTES = 15;
