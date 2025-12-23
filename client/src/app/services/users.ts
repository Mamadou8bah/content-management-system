import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Users {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {

  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }
  
  updateUser(id: string, updates: any):Observable<any>{
    return this.http.put(`${this.apiUrl}/users/${id}`, updates);
  }
}
 