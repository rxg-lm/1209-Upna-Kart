import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}
  
  toggleProducts = signal<boolean>(true);

  getProducts(limit = 12): Observable<{ products: Product[] }> {
    return this.http.get<{ products: Product[] }>(
      `${this.apiUrl}?limit=${limit}`
    );
  }
}
