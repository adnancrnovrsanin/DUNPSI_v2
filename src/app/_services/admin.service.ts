import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import {
  CreateDeveloperDto,
  CreateProductManagerDto,
  CreateProjectManagerDto,
} from '../_models/profiles';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createDeveloper(developer: CreateDeveloperDto) {
    return this.http.post(this.baseUrl + 'admin/users/developer', developer);
  }

  createProductManager(productManager: CreateProductManagerDto) {
    return this.http.post(
      this.baseUrl + 'admin/users/product-manager',
      productManager
    );
  }

  createProjectManager(projectManager: CreateProjectManagerDto) {
    return this.http.post(
      this.baseUrl + 'admin/users/project-manager',
      projectManager
    );
  }
}
