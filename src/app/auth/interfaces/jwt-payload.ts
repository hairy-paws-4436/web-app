import {RoleEnum} from '../enums/role-enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: RoleEnum;
  ongId?: string;
  userId: string;
  exp: number;
}
