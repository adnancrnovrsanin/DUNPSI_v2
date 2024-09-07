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

export interface Developer {
  id: string;
  appUserId: string;
  name: string;
  surname: string;
  email: string;
  profileImageUrl?: string;
  position: string;
  numberOfActiveTasks: number;
}
