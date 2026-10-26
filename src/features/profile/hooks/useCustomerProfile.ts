import { useState } from 'react';
import { MOCK_CUSTOMER_PROFILE, type CustomerProfile } from '../mocks/profile.mock';

export const useCustomerProfile = () => {
  const [profile, setProfile] = useState<CustomerProfile>(MOCK_CUSTOMER_PROFILE);
  const [activeTab, setActiveTab] = useState<'DEPOSIT' | 'PROFILE' | 'ADDRESS'>('DEPOSIT');

  // Modals state
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isRefundOpen, setIsRefundOpen] = useState(false);

  return {
    profile,
    setProfile,
    activeTab,
    setActiveTab,
    isReceiptOpen,
    setIsReceiptOpen,
    isTermsOpen,
    setIsTermsOpen,
    isRefundOpen,
    setIsRefundOpen,
  };
};
