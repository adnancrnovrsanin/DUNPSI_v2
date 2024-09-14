import { Developer } from './profiles';

export interface Requirement {
  id: string;
  projectId: string;
  phaseId: string;
  name: string;
  description: string;
  status: RequirementApproveStatus;
  serialNumber: number;
  idNumber: number;
  type: RequirementType;
  priority: RequirementPriority;
  assignedDevelopers: Developer[];
}

export interface CreateRequirementRequest {
  projectId: string;
  name: string;
  description: string;
  status: string;
  serialNumber: number;
  type: string;
  priority: number;
}

export enum RequirementApproveStatus {
  WAITING_PROJECT_MANAGER = 'WAITING_PROJECT_MANAGER',
  WAITING_PRODUCT_MANAGER = 'WAITING_PRODUCT_MANAGER',
  APPROVED = 'APPROVED',
  CHANGES_REQUIRED = 'CHANGES_REQUIRED',
  REJECTED = 'REJECTED',
}

export enum RequirementType {
  USER_STORY = 'USER_STORY',
  BUG = 'BUG',
  TASK = 'TASK',
}

export enum RequirementPriority {
  VeryLow = 1,
  Low = 2,
  Medium = 3,
  High = 4,
  VeryHigh = 5,
}

export interface GetRequirementsOnHoldRequest {
  projectId: string;
  status: string;
}
