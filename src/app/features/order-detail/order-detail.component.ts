import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { SupportOrderService } from '../../core/services/support-order.service';
import { OrderResponse, OrderStatus } from '../../core/models/support-order.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatSelectModule, MatFormFieldModule,
    MatSnackBarModule, MatProgressSpinnerModule, MatDividerModule
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(SupportOrderService);
  private readonly snackBar = inject(MatSnackBar);

  order = signal<OrderResponse | null>(null);
  loading = signal(true);
  updating = signal(false);
  selectedStatus = signal<OrderStatus | null>(null);

  // Transiciones permitidas según las reglas de negocio
  private readonly transitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.OPEN]: [OrderStatus.IN_PROGRESS, OrderStatus.CANCELLED],
    [OrderStatus.IN_PROGRESS]: [OrderStatus.RESOLVED, OrderStatus.CANCELLED],
    [OrderStatus.RESOLVED]: [],
    [OrderStatus.CANCELLED]: []
  };

  allowedTransitions = computed(() => {
    const current = this.order();
    return current ? this.transitions[current.status] : [];
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getOrderById(id).subscribe({
      next: (order) => {
        this.order.set(order);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/orders']);
      }
    });
  }

  onStatusChange() {
    const currentOrder = this.order();
    const newStatus = this.selectedStatus();
    if (!currentOrder || !newStatus) return;

    this.updating.set(true);
    this.service.updateOrderStatus(currentOrder.id, { status: newStatus }).subscribe({
      next: (updated) => {
        this.order.set(updated);
        this.selectedStatus.set(null);
        this.updating.set(false);
        this.snackBar.open(`Estado actualizado a ${updated.status}`, 'OK', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: () => {
        this.updating.set(false);
        this.selectedStatus.set(null);
      }
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
}