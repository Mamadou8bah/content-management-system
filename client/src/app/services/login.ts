import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Login {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {

  }

  
  loginUser(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }
  registerUser(formdata: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, formdata);
  }

  getLoggedInUser(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    return this.http.get(`${this.apiUrl}/auth/me`, { headers });
  }
  logoutUser(): Observable<any> {
    const refreshToken = localStorage.getItem('cms_refresh_token');
    return this.http.post(`${this.apiUrl}/auth/logout`, { refreshToken });
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('cms_refresh_token');
    return this.http.post(`${this.apiUrl}/auth/refresh`, { refreshToken });
  }
}
