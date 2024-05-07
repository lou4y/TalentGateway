import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { Category } from '../../models/categorys.model';

@Injectable({
  providedIn: 'root'
})
export class CategorysService {
  readonly API_URL = "http://localhost:8087/api/categories"; // Assuming this is your backend URL

  constructor(private httpClient: HttpClient) { }

  getAllCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.API_URL);
  }

  createCategory(category: { categoryName: any; userId: String; categoryDescription: any }): Observable<Category> {
    return this.httpClient.post<Category>(this.API_URL, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.API_URL}/${id}`);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.httpClient.get<Category>(`${this.API_URL}/${id}`);
  }

  updateCategory(category: Category): Observable<Category> {
    return this.httpClient.put<Category>(`${this.API_URL}/${category.categoryId}`, category);
  }

  getCategoriesByUser(userId: string): Observable<Category[]> {
    return this.httpClient.get<Category[]>(`${this.API_URL}/user/${userId}`);
  }

}
