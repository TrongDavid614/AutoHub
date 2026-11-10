import type { MockCar } from '../mocks/car.mock';

const API_BASE = 'http://localhost:8080/api';

export interface ProvinceDto {
  id: number;
  tenTinh: string;
  phanVungBienSo: string;
}

export interface EstimatorCalculationDto {
  variantId: number;
  variantName: string;
  giaNiemYet: number;
  mucTienCoc: number;
  tyLePhiTruocBa: number;
  phiTruocBa: number;
  phiCapBienSo: number;
  phiDangKiem: number;
  phiBaoTriDuongBo: number;
  phiBaoHiemTnds: number;
  tongChiPhiLanBanh: number;
}

function mapDtoToMockCar(dto: any): MockCar {
  let specs: Record<string, string> = {};
  if (typeof dto.thongSoKyThuat === 'string' && dto.thongSoKyThuat.trim().startsWith('{')) {
    try {
      specs = JSON.parse(dto.thongSoKyThuat);
    } catch {
      specs = {};
    }
  } else if (typeof dto.thongSoKyThuat === 'object' && dto.thongSoKyThuat !== null) {
    specs = dto.thongSoKyThuat;
  }

  const price = Number(dto.giaNiemYet) || 2890000000;
  const deposit = Number(dto.mucTienCoc) || 20000000;

  let segment = 'Sedan thể thao';
  const rawSegment = dto.dongXe?.phanKhuc?.toLowerCase() || '';
  if (rawSegment.includes('suv')) {
    segment = 'SUV Đa dụng';
  } else if (rawSegment.includes('sedan')) {
    segment = 'Sedan thể thao';
  } else if (rawSegment.includes('mpv')) {
    segment = 'MPV Cao cấp';
  } else if (dto.dongXe?.phanKhuc) {
    segment = dto.dongXe.phanKhuc;
  }

  const badge = price >= 3200000000
    ? 'FLAGSHIP • TRACK'
    : price >= 2000000000
      ? 'KHUYÊN DÙNG'
      : 'TIÊU CHUẨN';

  const defaultColors = [
    { name: 'Xanh Riviera', hex: '#0284C7' },
    { name: 'Trắng Ceramic', hex: '#F8FAFC' },
    { name: 'Xám Liquid', hex: '#94A3B8' },
    { name: 'Đen Obsidian', hex: '#0F172A' },
  ];

  const availableColors = (Array.isArray(dto.colors) && dto.colors.length > 0)
    ? dto.colors.map((c: any) => ({ name: c.tenMau, hex: c.maHex }))
    : defaultColors;

  const defaultImg = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200';
  const imgList: string[] = Array.isArray(dto.images) && dto.images.length > 0
    ? dto.images
    : [dto.image || defaultImg];

  const acceleration = specs.tang_toc || (dto.loaiNhienLieu?.includes('Hybrid') ? '7.5s' : '3.2 giây');
  const power = specs.cong_suat || specs.dong_co || '680 HP';
  const range = specs.tam_chay || (dto.loaiNhienLieu?.includes('Hybrid') ? '850 km' : '680 km (WLTP)');
  const charging = specs.sac || (dto.loaiNhienLieu?.includes('Hybrid') ? 'Đổ xăng & Tự sạc' : '10–80% trong 15 phút (350kW)');
  const feature1 = specs.adas || 'HubPilot 2+ tự hành';
  const feature2 = specs.ghe || specs.phanh || specs.dan_dong || 'Treo khí nén thích ứng';

  return {
    id: String(dto.id),
    name: dto.tenPhienBan || 'AutoHub EV',
    badge,
    segment,
    subtitle: `${dto.dongXe?.hangXe?.tenHangXe || 'AutoHub'} • ${dto.dongXe?.tenDongXe || ''} • ${dto.hopSo || 'Tự động'}`,
    powertrain: dto.loaiNhienLieu || 'Thuần điện EV 800V SiC',
    seats: `${dto.soChoNgoi || 5} Chỗ Tiêu chuẩn`,
    acceleration,
    power,
    range,
    charging,
    feature1,
    feature2,
    listedPrice: price,
    depositAmount: deposit,
    depositNote: `Cọc giữ xe 72h: ${deposit.toLocaleString('vi-VN')} đ`,
    estimatedOnRoad: Math.round(price * 1.12 + 23000000),
    image: imgList[0] || defaultImg,
    images: imgList,
    availableColors,
    gridSpecs: {
      s1Label: '0-100 KM/H',
      s1Val: acceleration,
      s2Label: 'TẦM HOẠT ĐỘNG',
      s2Val: range,
      s3Label: 'SẠC / NHIÊN LIỆU',
      s3Val: charging.length > 25 ? '15 phút' : charging,
    },
  };
}

export const carService = {
  async getAllCars(): Promise<MockCar[]> {
    try {
      const res = await fetch(`${API_BASE}/customer/cars`);
      if (res.ok) {
        const json = await res.json();
        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          return json.data.map(mapDtoToMockCar);
        }
      }
    } catch {
      // Network error
    }
    return [];
  },

  async getCarById(id: string): Promise<MockCar | null> {
    try {
      const res = await fetch(`${API_BASE}/customer/cars/${id}`);
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          return mapDtoToMockCar(json.data);
        }
      }
    } catch {
      // Network error
    }

    return null;
  },

  async getProvinces(): Promise<ProvinceDto[]> {
    try {
      const res = await fetch(`${API_BASE}/customer/estimator/provinces`);
      if (res.ok) {
        const json = await res.json();
        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          return json.data;
        }
      }
    } catch {
      // Fallback
    }
    return [
      { id: 1, tenTinh: 'Hà Nội', phanVungBienSo: 'Vùng 1' },
      { id: 2, tenTinh: 'TP. Hồ Chí Minh', phanVungBienSo: 'Vùng 1' },
      { id: 3, tenTinh: 'Đà Nẵng', phanVungBienSo: 'Vùng 2' },
      { id: 4, tenTinh: 'Hải Phòng', phanVungBienSo: 'Vùng 2' },
      { id: 5, tenTinh: 'Cần Thơ', phanVungBienSo: 'Vùng 2' },
      { id: 6, tenTinh: 'Bình Dương', phanVungBienSo: 'Vùng 2' },
      { id: 7, tenTinh: 'Đồng Nai', phanVungBienSo: 'Vùng 2' },
      { id: 8, tenTinh: 'Quảng Ninh', phanVungBienSo: 'Vùng 3' },
    ];
  },

  async calculateEstimator(variantId: number, tinhThanhId: number): Promise<EstimatorCalculationDto | null> {
    try {
      const res = await fetch(`${API_BASE}/customer/estimator/calculate?variantId=${variantId}&tinhThanhId=${tinhThanhId}`);
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          return json.data;
        }
      }
    } catch {
      // Fallback
    }
    return null;
  },
};
