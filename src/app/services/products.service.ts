import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { retry, catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { environment } from 'src/environments/environment';

import { checkTime } from '../interceptors/time.interceptor';

import { CreateProductDTO, Product, UpdateProductDTO } from './../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  /* private apiURL = `${environment.API_URL}/api/products` */
  private apiURL = `https://young-sands-07814.herokuapp.com/api/products`
  constructor(
    private http: HttpClient
  ) { }

  getAllProducts(limit?: number, offset?: number) {
    let params = new HttpParams();
    if(limit && offset){
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http.get<Product[]>(this.apiURL, {params, context: checkTime()})
    .pipe(
      retry(3),
      map(products => products.map(item => {
        return {
          ...item,
          taxes: .19*item.price
        }
      }))
    );
  }

  getProduct(id: string){
    return this.http.get<Product>(`${this.apiURL}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === 500){
          return throwError('Algo está fallando en el server.')
        }
        if(error.status === 404){
          return throwError('No se encuentra el producto.')
        }
        return throwError('ups algo salió mal.')
      })
    );
  }
  getByPages(limit: number, offset: number){
    return this.http.get<Product[]>(`${this.apiURL}`,{
      params: {limit, offset}
    });
  }
  create(data: CreateProductDTO){
    return this.http.post<Product>(this.apiURL, data);
  }
  //put todo
  // patch solo un atributo
  update(id: string, dto: UpdateProductDTO){
    return this.http.put<Product>(`${this.apiURL}/${id}`, dto);
  }

  delete(id: string){
    return this.http.delete<boolean>(`${this.apiURL}/${id}`);
  }

}
