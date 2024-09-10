import { Developer } from './profiles';

export interface Requirement {
  id: string;
  projectId: string;
  phaseId: string;
  name: string;
  description: string;
  status: RequirementApproveStatus;
  serialNumber: number;
  assignedDevelopers: Developer[];
}

export interface CreateRequirementRequest {
  projectId: string;
  name: string;
  description: string;
  status: string;
  serialNumber: number;
}

export enum RequirementApproveStatus {
  WAITING_PROJECT_MANAGER = 'WAITING_PROJECT_MANAGER',
  WAITING_PRODUCT_MANAGER = 'WAITING_PRODUCT_MANAGER',
  APPROVED = 'APPROVED',
  CHANGES_REQUIRED = 'CHANGES_REQUIRED',
  REJECTED = 'REJECTED',
}

export interface GetRequirementsOnHoldRequest {
  projectId: string;
  status: string;
}
