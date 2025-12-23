import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getArticles(): Observable<any> {
    console.log('Working')
    return this.http.get(`${this.apiUrl}/articles`);
    
  }
  postArticle(formdata: FormData): Observable<any> {
    console.log('Post Working')
    return this.http.post(`${this.apiUrl}/articles`, formdata);
  }
  
  publishArticle(articleId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/articles/${articleId}/publish`, {});
  }

  unpublishArticle(articleId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/articles/${articleId}`, { status: 'draft' });
  }
  updateArticle(articleId: string, updates: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/articles/${articleId}`, updates);
  }

  softDeleteArticle(articleId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/articles/${articleId}`, {});
  }
}
