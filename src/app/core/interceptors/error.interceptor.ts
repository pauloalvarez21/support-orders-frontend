import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiErrorResponse } from '../models/support-order.model';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocurrió un error inesperado.';
      
      if (error.error && typeof error.error === 'object') {
        const apiError = error.error as ApiErrorResponse;
        
        if (apiError.fieldErrors) {
          errorMessage = Object.values(apiError.fieldErrors).join(' | ');
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
      }

      snackBar.open(errorMessage, 'Cerrar', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      
      return throwError(() => error);
    })
  );
};