export interface ShippingAddress {
  id: string;
  recipientName: string;
  phone: string;
  fullAddress: string;
  tag?: string;
  isDefault: boolean;
  technicalNote?: string;
}

export const DEFAULT_SHIPPING_ADDRESS: ShippingAddress = {
  id: '',
  recipientName: '',
  phone: '',
  fullAddress: '',
  isDefault: true,
};

export const MOCK_ADDRESS_BOOK: ShippingAddress[] = [];
