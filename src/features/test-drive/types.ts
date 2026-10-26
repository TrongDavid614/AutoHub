export type TestDriveStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';

export interface TestDriveItem {
  id: number;
  bookingCode: string;
  carModelName: string;
  carVariant: string;
  carImageUrl: string;
  showroomName: string;
  showroomAddress: string;
  locationType: 'SHOWROOM' | 'HOME';
  bookingDate: string;
  timeSlot: string;
  status: TestDriveStatus;
  hasDrivingLicense: boolean;
  demoCarPlate?: string;
  consultantName?: string;
  evaluationNote?: string;
  createdAt: string;
}
