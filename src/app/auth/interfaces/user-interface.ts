export interface UserInterface {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  address: string;
  profileImageUrl?: string | null;
  twoFactorEnabled?: boolean;
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PasswordChangeInterface {
  oldPassword: string;
  newPassword: string;
}
