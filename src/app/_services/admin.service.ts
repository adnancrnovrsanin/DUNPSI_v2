import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  searchUsers(searchText: string) {
    return this.http.get<User[]>(this.baseUrl + 'admin/search/' + searchText);
  }

  getAllUsers() {
    return this.http.get<User[]>(this.baseUrl + 'admin/search/all');
  }
}
