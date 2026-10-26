import { MOCK_CUSTOMER_PROFILE, type CustomerProfile } from '../mocks/profile.mock';

export const profileService = {
  getCustomerProfile(): Promise<CustomerProfile> {
    return Promise.resolve(MOCK_CUSTOMER_PROFILE);
  },

  updateProfile(profile: Partial<CustomerProfile>): Promise<CustomerProfile> {
    return Promise.resolve({ ...MOCK_CUSTOMER_PROFILE, ...profile });
  },

  requestDepositRefund(depositId: string, reason: string): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Yêu cầu hoàn cọc cho đơn ${depositId} đã được tiếp nhận thành công. Lý do: ${reason}`,
        });
      }, 600);
    });
  },
};
