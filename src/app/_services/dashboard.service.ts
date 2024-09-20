import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CompanyDashboardData,
  ProjectDashboardDto,
} from '../_models/dashboard';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getManagerDashboardData(managerId: string) {
    return this.http.get<ProjectDashboardDto>(
      this.baseUrl + `dashboard/manager/${managerId}`
    );
  }

  getCompanyDashboardData() {
    return this.http.get<CompanyDashboardData>(
      this.baseUrl + 'dashboard/company'
    );
  }
}
