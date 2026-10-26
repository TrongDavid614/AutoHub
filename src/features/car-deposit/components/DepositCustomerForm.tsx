import React from 'react';
import { MOCK_DEPOSIT_SHOWROOMS } from '../mocks/deposit.mock';

interface DepositCustomerFormProps {
  fullName: string;
  setFullName: (val: string) => void;
  phoneNumber: string;
  setPhoneNumber: (val: string) => void;
  identityCard: string;
  setIdentityCard: (val: string) => void;
  selectedShowroom: string;
  setSelectedShowroom: (val: string) => void;
}

export const DepositCustomerForm: React.FC<DepositCustomerFormProps> = ({
  fullName,
  setFullName,
  phoneNumber,
  setPhoneNumber,
  identityCard,
  setIdentityCard,
  selectedShowroom,
  setSelectedShowroom,
}) => {
  return (
    <div className="space-y-3">
      {/* Họ và tên */}
      <div className="space-y-1">
        <label className="text-[#BEC8D2] font-semibold uppercase text-[10px] font-mono">
          HỌ VÀ TÊN NGƯỜI ĐẶT CỌC *
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          placeholder="Nguyễn Văn A"
          className="w-full px-3.5 py-2.5 rounded bg-[#222A3D] border border-[#3E4850]/60 text-sm text-[#DAE2FD] focus:outline-none focus:border-[#89CEFF]"
        />
      </div>

      {/* Số điện thoại */}
      <div className="space-y-1">
        <label className="text-[#BEC8D2] font-semibold uppercase text-[10px] font-mono">
          SỐ ĐIỆN THOẠI LIÊN HỆ *
        </label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          placeholder="0912 345 678"
          className="w-full px-3.5 py-2.5 rounded bg-[#222A3D] border border-[#3E4850]/60 text-sm text-[#DAE2FD] focus:outline-none focus:border-[#89CEFF]"
        />
      </div>

      {/* Số CCCD */}
      <div className="space-y-1">
        <label className="text-[#BEC8D2] font-semibold uppercase text-[10px] font-mono">
          SỐ CĂN CƯỚC CÔNG DÂN (CCCD) *
        </label>
        <input
          type="text"
          value={identityCard}
          onChange={(e) => setIdentityCard(e.target.value)}
          required
          placeholder="001201012345"
          className="w-full px-3.5 py-2.5 rounded bg-[#222A3D] border border-[#3E4850]/60 text-sm text-[#DAE2FD] focus:outline-none focus:border-[#89CEFF]"
        />
        <div className="text-[11px] text-[#88929B] italic pt-0.5">
          * Bắt buộc để đối soát pháp lý và lập hợp đồng cọc điện tử chính thức.
        </div>
      </div>

      {/* Showroom nhận xe */}
      <div className="space-y-1">
        <label className="text-[#BEC8D2] font-semibold uppercase text-[10px] font-mono">
          SHOWROOM NHẬN BÀN GIAO XE *
        </label>
        <select
          value={selectedShowroom}
          onChange={(e) => setSelectedShowroom(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded bg-[#222A3D] border border-[#3E4850]/60 text-sm text-[#DAE2FD] focus:outline-none focus:border-[#89CEFF]"
        >
          {MOCK_DEPOSIT_SHOWROOMS.map((sr) => (
            <option key={sr.id} value={sr.name}>
              {sr.name} - {sr.city}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
