import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SupportOrderService } from '../../core/services/support-order.service';
import { Category, Channel, Priority } from '../../core/models/support-order.model';

@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule,
    MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './order-create.component.html',
  styleUrl: './order-create.component.scss'
})
export class OrderCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(SupportOrderService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  submitting = signal(false);

  form = this.fb.group({
    externalReference: ['', [Validators.required]],
    customerId: ['', [Validators.required]],
    category: [null as Category | null, [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    channel: [null as Channel | null, [Validators.required]],
    priority: [null as Priority | null, [Validators.required]]
  });

  categories = Object.values(Category);
  channels = Object.values(Channel);
  priorities = Object.values(Priority);

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.service.createOrder(this.form.getRawValue() as any).subscribe({
      next: (order) => {
        this.snackBar.open(`Orden ${order.externalReference} creada exitosamente`, 'OK', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/orders', order.id]);
      },
      error: () => this.submitting.set(false)
    });
  }
}