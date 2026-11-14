
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  CreateOrderRequest, 
  OrderResponse, 
  OrderSummary, 
  UpdateStatusRequest 
} from '../models/support-order.model';

@Injectable({
  providedIn: 'root'
})
export class SupportOrderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/support-orders';

  createOrder(request: CreateOrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(this.apiUrl, request);
  }

  getOrders(status?: string): Observable<OrderSummary[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<OrderSummary[]>(this.apiUrl, { params });
  }

  getOrderById(id: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/${id}`);
  }

  updateOrderStatus(id: number, request: UpdateStatusRequest): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${this.apiUrl}/${id}/status`, request);
  }
}