import { axiosClient } from '@/lib/axios';
import type { ApiResponse } from '@/types/api.types';
import type { CarComparisonData } from '../types/comparison.types';
import { MOCK_CARS, type MockCar } from '../mocks/car.mock';

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
  tyLePhiTruocBaStandard?: number;
  phiTruocBa: number;
  phiTruocBaStandard?: number;
  isElectric?: boolean;
  provinceName?: string;
  phiCapBienSo: number;
  phiDangKiem: number;
  phiBaoTriDuongBo: number;
  phiBaoHiemTnds: number;
  tongChiPhiLanBanh: number;
}

interface RawVariantDto {
  id: number | string;
  variantName?: string;
  tenPhienBan?: string;
  name?: string;
  listedPrice?: number;
  giaNiemYet?: number;
  depositPrice?: number;
  mucTienCoc?: number;
  depositAmount?: number;
  transmission?: string;
  hopSo?: string;
  fuelType?: string;
  loaiNhienLieu?: string;
  rangeKm?: number;
  tamHoatDongKm?: number;
  desc?: string;
  badge?: string;
  isCurrent?: boolean;
}

interface RawColorDto {
  id?: number;
  tenMau?: string;
  colorName?: string;
  name?: string;
  maHex?: string;
  colorCodeHex?: string;
  hex?: string;
}

interface RawCarDto {
  id: number;
  tenPhienBan?: string;
  variantName?: string;
  name?: string;
  giaNiemYet?: number;
  listedPrice?: number;
  mucTienCoc?: number;
  depositPrice?: number;
  depositAmount?: number;
  namSanXuat?: number;
  releaseYear?: number;
  hopSo?: string;
  transmission?: string;
  loaiNhienLieu?: string;
  fuelType?: string;
  powertrain?: string;
  soChoNgoi?: number;
  seats?: string | number;
  thongSoKyThuat?: string | Record<string, string>;
  specs?: Record<string, string>;
  tamHoatDongKm?: number;
  rangeKm?: number;
  dungLuongPinKwh?: number;
  batteryKwh?: number;
  dangHoatDong?: boolean;
  image?: string;
  images?: string[];
  colors?: RawColorDto[];
  availableColors?: RawColorDto[];
  variants?: RawVariantDto[];
  dongXe?: {
    id?: number;
    tenDongXe?: string;
    modelName?: string;
    phanKhuc?: string;
    segment?: string;
    xuatXu?: string;
    moTa?: string;
    hangXe?: {
      id?: number;
      tenHangXe?: string;
      brandName?: string;
    };
  };
}

function mapDtoToMockCar(dto: RawCarDto): MockCar {
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
  if (dto.specs && typeof dto.specs === 'object') {
    specs = { ...specs, ...dto.specs };
  }

  const price = Number(dto.listedPrice || dto.giaNiemYet) || 2890000000;
  const deposit = Number(dto.depositPrice || dto.depositAmount || dto.mucTienCoc) || 20000000;

  let segment = 'Sedan thể thao';
  const rawSegment = (dto.dongXe?.segment || dto.dongXe?.phanKhuc || '').toLowerCase();
  if (rawSegment.includes('suv')) {
    segment = 'SUV Đa dụng';
  } else if (rawSegment.includes('sedan')) {
    segment = 'Sedan thể thao';
  } else if (rawSegment.includes('mpv')) {
    segment = 'MPV Cao cấp';
  } else if (dto.dongXe?.phanKhuc || dto.dongXe?.segment) {
    segment = dto.dongXe.phanKhuc || dto.dongXe.segment || 'Sedan thể thao';
  }

  const badge = price >= 3200000000
    ? 'FLAGSHIP • TRACK'
    : price >= 2000000000
      ? 'KHUYÊN DÙNG'
      : 'TIÊU CHUẨN';

  const defaultColors = [
    { id: 1, name: 'Xanh Riviera', hex: '#0284C7' },
    { id: 2, name: 'Trắng Ceramic', hex: '#F8FAFC' },
    { id: 3, name: 'Xám Liquid', hex: '#94A3B8' },
    { id: 4, name: 'Đen Obsidian', hex: '#0F172A' },
  ];

  const rawColors = (Array.isArray(dto.availableColors) && dto.availableColors.length > 0)
    ? dto.availableColors
    : (Array.isArray(dto.colors) && dto.colors.length > 0 ? dto.colors : []);

  const availableColors = rawColors.length > 0
    ? rawColors.map((c) => ({
        id: c.id,
        name: c.name || c.colorName || c.tenMau || 'Xanh AutoHub',
        hex: c.hex || c.colorCodeHex || c.maHex || '#0284C7',
      }))
    : defaultColors;

  const defaultImg = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200';
  const imgList: string[] = Array.isArray(dto.images) && dto.images.length > 0
    ? dto.images
    : [dto.image || defaultImg];

  const acceleration = specs.tang_toc || (dto.loaiNhienLieu?.includes('Hybrid') ? '7.5s' : '3.2 giây');
  const power = specs.cong_suat || specs.dong_co || '680 HP';
  const range = specs.tam_chay || (dto.tamHoatDongKm ? `${dto.tamHoatDongKm} km` : (dto.loaiNhienLieu?.includes('Hybrid') ? '850 km' : '680 km (WLTP)'));
  const charging = specs.sac || (dto.loaiNhienLieu?.includes('Hybrid') ? 'Đổ xăng & Tự sạc' : '10–80% trong 15 phút (350kW)');
  const feature1 = specs.adas || 'HubPilot 2+ tự hành';
  const feature2 = specs.ghe || specs.phanh || specs.dan_dong || specs.treo || 'Treo khí nén thích ứng';

  const mappedVariants = Array.isArray(dto.variants)
    ? dto.variants.map((v) => ({
        id: String(v.id),
        variantName: v.variantName || v.tenPhienBan || v.name || 'Phiên bản',
        tenPhienBan: v.tenPhienBan || v.variantName || v.name || 'Phiên bản',
        listedPrice: Number(v.listedPrice || v.giaNiemYet) || price,
        giaNiemYet: Number(v.giaNiemYet || v.listedPrice) || price,
        depositPrice: Number(v.depositPrice || v.depositAmount || v.mucTienCoc) || deposit,
        depositAmount: Number(v.depositAmount || v.depositPrice || v.mucTienCoc) || deposit,
        mucTienCoc: Number(v.mucTienCoc || v.depositAmount || v.depositPrice) || deposit,
        transmission: v.transmission || v.hopSo || 'Tự động',
        hopSo: v.hopSo || v.transmission || 'Tự động',
        fuelType: v.fuelType || v.loaiNhienLieu || 'Thuần điện',
        loaiNhienLieu: v.loaiNhienLieu || v.fuelType || 'Thuần điện',
        rangeKm: Number(v.rangeKm || v.tamHoatDongKm) || undefined,
        tamHoatDongKm: Number(v.tamHoatDongKm || v.rangeKm) || undefined,
        desc: v.desc || (v.transmission || v.hopSo || ''),
        badge: v.badge || '',
        isCurrent: Boolean(v.isCurrent),
      }))
    : undefined;

  return {
    id: String(dto.id),
    name: dto.name || dto.variantName || dto.tenPhienBan || 'AutoHub EV',
    badge,
    segment,
    subtitle: `${dto.dongXe?.hangXe?.tenHangXe || dto.dongXe?.hangXe?.brandName || 'AutoHub'} • ${dto.dongXe?.tenDongXe || dto.dongXe?.modelName || ''} • ${dto.hopSo || dto.transmission || 'Tự động'}`,
    powertrain: dto.loaiNhienLieu || dto.fuelType || dto.powertrain || 'Thuần điện EV 800V SiC',
    seats: `${dto.soChoNgoi || dto.seats || 5} Chỗ Tiêu chuẩn`,
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
    variants: mappedVariants,
    specs,
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
      const res = await axiosClient.get<unknown, ApiResponse<RawCarDto[]>>('/customer/cars');
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map((dto, idx) => {
          try {
            return mapDtoToMockCar(dto);
          } catch (e) {
            console.error(`[carService] mapDtoToMockCar failed at index ${idx}:`, e, dto);
            return null;
          }
        }).filter((c): c is MockCar => c !== null);
        if (mapped.length > 0) return mapped;
      }
    } catch (err) {
      console.error('[carService] getAllCars network error:', err);
    }
    return MOCK_CARS;
  },

  async getCarById(id: string): Promise<MockCar | null> {
    try {
      const res = await axiosClient.get<unknown, ApiResponse<RawCarDto>>(`/customer/cars/${id}`);
      if (res?.data) {
        return mapDtoToMockCar(res.data);
      }
    } catch {
      // Network error - fallback to mock car
    }

    return MOCK_CARS.find((c) => c.id === String(id)) || null;
  },

  async getProvinces(): Promise<ProvinceDto[]> {
    try {
      const res = await axiosClient.get<unknown, ApiResponse<ProvinceDto[]>>('/customer/estimator/provinces');
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
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
      const res = await axiosClient.get<unknown, ApiResponse<EstimatorCalculationDto>>(
        `/customer/estimator/calculate?variantId=${variantId}&tinhThanhId=${tinhThanhId}&provinceId=${tinhThanhId}`
      );
      if (res?.data) {
        return res.data;
      }
    } catch {
      // Fallback
    }
    return null;
  },

  async getCarComparison(ids?: (number | string)[]): Promise<CarComparisonData | null> {
    try {
      const query = ids && ids.length > 0 ? `?ids=${ids.join(',')}` : '';
      const res = await axiosClient.get<unknown, ApiResponse<CarComparisonData>>(`/customer/cars/compare${query}`);
      if (res?.data && res.data.trims && res.data.trims.length > 0) {
        return res.data;
      }
    } catch (err) {
      console.error('[carService] getCarComparison network error:', err);
    }
    return null;
  },
};
