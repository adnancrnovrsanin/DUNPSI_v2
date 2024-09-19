import { CreateUserDto } from './user';

export interface ProjectManager {
  id: string;
  appUserId: string;
  name: string;
  surname: string;
  email: string;
  profileImageUrl?: string;
  certificateUrl: string;
  yearsOfExperience: number;
  currentTeamId: string;
}

export interface ProductManager {
  id: string;
  appUserId: string;
  name: string;
  surname: string;
  email: string;
  profileImageUrl?: string;
}

export interface Admin {
  id: string;
  appUserId: string;
  name: string;
  surname: string;
  email: string;
  profileImageUrl?: string;
}

export interface Developer {
  id: string;
  appUserId: string;
  name: string;
  surname: string;
  email: string;
  profileImageUrl?: string;
  qualityRating: number;
  ratingCount: number;
  position: string;
  numberOfActiveTasks: number;
}

export interface CreateDeveloperDto {
  user: CreateUserDto;
  position: string;
  numberOfActiveTasks: number; // Ignore this field
}

export interface CreateProductManagerDto {
  user: CreateUserDto;
}

export interface CreateProjectManagerDto {
  user: CreateUserDto;
  certificateUrl: string;
  yearsOfExperience: number;
}
