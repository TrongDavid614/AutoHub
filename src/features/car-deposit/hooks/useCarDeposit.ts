import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { depositService } from '../services/deposit.service';
import { FIXED_DEPOSIT_AMOUNT } from '../mocks/deposit.mock';

export interface UseCarDepositProps {
  carVariant?: string;
  exteriorColor?: string;
  onSuccess?: () => void;
}

export const useCarDeposit = ({
  carVariant = 'Grand Touring',
  exteriorColor = 'Xanh Phantom',
  onSuccess,
}: UseCarDepositProps = {}) => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('Nguyễn Văn A');
  const [phoneNumber, setPhoneNumber] = useState('0912 345 678');
  const [identityCard, setIdentityCard] = useState('001201012345');
  const [selectedShowroom, setSelectedShowroom] = useState('Showroom Q7 TP.HCM');
  const [paymentMethod, setPaymentMethod] = useState<'VNPAY_QR' | 'ATM_CARD'>('VNPAY_QR');
  const [agreed, setAgreed] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // 15:00 countdown timer
  const [timerSeconds, setTimerSeconds] = useState(14 * 60 + 59);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      alert('Vui lòng đồng ý với điều khoản giữ xe trong 72 giờ.');
      return;
    }

    setIsProcessing(true);
    try {
      await depositService.submitDeposit({
        carVariant,
        exteriorColor,
        fullName,
        phoneNumber,
        identityCard,
        showroom: selectedShowroom,
        paymentMethod,
        amount: FIXED_DEPOSIT_AMOUNT,
      });

      if (onSuccess) {
        onSuccess();
      }
      navigate('/customer/profile');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
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
  };
};
