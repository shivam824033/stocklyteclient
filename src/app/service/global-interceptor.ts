import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';


export const globalInterceptor: HttpInterceptorFn = (request, next) => {

   const router = inject(Router);

    const jwtToken = localStorage.getItem('token');
    console.log('JWT Token from Interceptor:', jwtToken);
    if(jwtToken!==null){
      request = request.clone({ headers: request.headers.set('Authorization', 'Bearer '+ jwtToken)});

    }

  return next(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          let errorMessage = error.error?.message || 'Unauthorized Access.';
          console.log('Redirecting to unauthorized page with message:', errorMessage);
          router.navigate(['/unauthorized'], { queryParams: { message: errorMessage } });
        }
        return throwError(() => error);
      })
    );
};

