export type TestDriveStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED';

export interface TestDriveBooking {
  id: number;
  bookingCode: string;
  customerId: number;
  customerName: string;
  customerPhone: string;
  driverLicenseNumber: string;
  carVariantId: number;
  carVariantName: string;
  showroomLocation: string;
  bookingTime: string;
  status: TestDriveStatus;
  assignedDemoCarPlate?: string;
  staffConsultantId?: number;
  staffConsultantName?: string;
  notes?: string;
  createdAt: string;
}
