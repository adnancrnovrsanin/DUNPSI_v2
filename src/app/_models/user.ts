import { Photo } from './photo';

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  profileImageUrl: string | null;
  role: Role;
  token: string;
  photos: Photo[];
}

export interface CreateUserDto {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export enum Role {
  PRODUCT_MANAGER = 'PRODUCT_MANAGER',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  DEVELOPER = 'DEVELOPER',
  SOFTWARE_COMPANY = 'SOFTWARE_COMPANY',
}
