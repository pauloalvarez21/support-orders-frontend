import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SupportOrderService } from '../../core/services/support-order.service';
import { OrderSummary, OrderStatus } from '../../core/models/support-order.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatCardModule, MatTableModule, MatFormFieldModule,
    MatSelectModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatProgressSpinnerModule, MatTooltipModule
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent implements OnInit {
  private readonly service = inject(SupportOrderService);

  orders = signal<OrderSummary[]>([]);
  loading = signal(false);
  statusFilter = new FormControl<string>('');

  displayedColumns = ['id', 'externalReference', 'category', 'priority', 'status', 'createdAt', 'actions'];

  ngOnInit() {
    this.loadOrders();
    
    // Filtro reactivo: se ejecuta 300ms después de que el usuario deja de seleccionar
    this.statusFilter.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => this.loadOrders());
  }

  loadOrders() {
    this.loading.set(true);
    const status = this.statusFilter.value || undefined;
    this.service.getOrders(status).subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getStatusColor(status: OrderStatus): string {
    const colors: Record<OrderStatus, string> = {
      [OrderStatus.OPEN]: 'accent',
      [OrderStatus.IN_PROGRESS]: 'primary',
      [OrderStatus.RESOLVED]: 'warn',
      [OrderStatus.CANCELLED]: ''
    };
    return colors[status];
  }

  getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      'LOW': 'Baja',
      'MEDIUM': 'Media',
      'HIGH': 'Alta'
    };
    return labels[priority] || priority;
  }
}