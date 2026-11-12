export interface MockCar {
  id: string;
  name: string;
  badge: string;
  segment: string;
  subtitle: string;
  powertrain: string;
  seats: string;
  acceleration: string;
  power: string;
  range: string;
  charging: string;
  feature1: string;
  feature2: string;
  listedPrice: number;
  depositAmount: number;
  depositNote: string;
  estimatedOnRoad: number;
  image: string;
  images?: string[];
  availableColors: { name: string; hex: string }[];
  gridSpecs?: {
    s1Label: string;
    s1Val: string;
    s2Label: string;
    s2Val: string;
    s3Label: string;
    s3Val: string;
  };
  isUpcoming?: boolean;
}

export const MOCK_CARS: MockCar[] = [];
