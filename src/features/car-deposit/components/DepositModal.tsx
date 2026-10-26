import React from 'react';
import { DepositHeader } from './DepositHeader';
import { DepositSummaryCard } from './DepositSummaryCard';
import { DepositCustomerForm } from './DepositCustomerForm';
import { DepositPaymentSelector } from './DepositPaymentSelector';
import { useCarDeposit } from '../hooks/useCarDeposit';

export interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  carVariant?: string;
  exteriorColor?: string;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  carVariant = 'Grand Touring',
  exteriorColor = 'Xanh Phantom',
}) => {
  const {
    fullName,
    setFullName,
    phoneNumber,
    setPhoneNumber,
    identityCard,
    setIdentityCard,
    selectedShowroom,
    setSelectedShowroom,
    paymentMethod,
    setPaymentMethod,
    agreed,
    setAgreed,
    isProcessing,
    formattedTime,
    handleSubmit,
  } = useCarDeposit({
    carVariant,
    exteriorColor,
    onSuccess: onClose,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-sans text-[#DAE2FD]">
      <div className="relative w-full max-w-[620px] bg-[#131D35] border border-[#06B6D4]/30 rounded-lg shadow-[0_24px_60px_-12px_rgba(0,0,0,0.85),0_0_32px_-6px_rgba(14,165,233,0.25)] overflow-hidden my-6">
        {/* Top Ambient Highlight */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#0EA5E9] to-transparent opacity-80" />

        {/* 1. Header */}
        <DepositHeader onClose={onClose} />

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto text-xs">
          {/* 2. Summary Card */}
          <DepositSummaryCard
            carVariant={carVariant}
            exteriorColor={exteriorColor}
            formattedTime={formattedTime}
          />

          {/* 3. Customer Identity Fields */}
          <DepositCustomerForm
            fullName={fullName}
            setFullName={setFullName}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            identityCard={identityCard}
            setIdentityCard={setIdentityCard}
            selectedShowroom={selectedShowroom}
            setSelectedShowroom={setSelectedShowroom}
          />

          {/* 4. Payment Selector & Compliance */}
          <DepositPaymentSelector
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            agreed={agreed}
            setAgreed={setAgreed}
            isProcessing={isProcessing}
            onCancel={onClose}
          />
        </form>
      </div>
    </div>
  );
};
