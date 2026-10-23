export const APP_NAME = 'AutoHub';

export const ROLES = {
  CUSTOMER: 'ROLE_CUSTOMER',
  STAFF: 'ROLE_STAFF',
  ADMIN: 'ROLE_ADMIN',
} as const;

export const CAR_DEPOSIT_EXPIRATION_HOURS = 72;
export const MAX_COMPARE_CARS = 3;

export const VN_PHONE_REGEX = /^(0)(3|5|7|8|9)[0-9]{8}$/;
export const CCCD_REGEX = /^[0-9]{12}$/;
