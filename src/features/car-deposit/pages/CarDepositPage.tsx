import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DepositModal } from '../components/DepositModal';

export const CarDepositPage: React.FC = () => {
  const navigate = useNavigate();
  const { variantId } = useParams<{ variantId?: string }>();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#060E20] flex items-center justify-center p-4">
      <DepositModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          navigate(-1);
        }}
        carVariant={variantId ? variantId.toUpperCase() : 'Grand Touring'}
      />
    </div>
  );
};

export default CarDepositPage;
