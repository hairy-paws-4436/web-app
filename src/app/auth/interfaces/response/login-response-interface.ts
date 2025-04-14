import {UserInterface} from '../user-interface';

export interface LoginResponseInterface {
  access_token?: string;
  requiresTwoFactor?: boolean;
  userId?: string;
  user?: UserInterface;
}
