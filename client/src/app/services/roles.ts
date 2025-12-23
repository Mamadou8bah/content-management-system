import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Roles {
  
   apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {

  }

  getRoles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/roles`);
  }
  getPermissions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/permissions`);
  }

  createRole(role: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/roles`, role);
  }

  deleteRole(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/roles/${id}`);
  }

  updatePermissions(roleId: string, permissionIds: string[]): Observable<any> {
    return this.http.put(`${this.apiUrl}/roles/${roleId}/permissions`, { permissionIds });
  }
 
  
}
