import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  
  // Get the XSRF token from the cookie
  const xsrfToken = cookieService.get('EduDoc-1.0.0-XSRF-TOKEN');

  // Get the JWT from the cookie
  const jwtCookie = cookieService.get('EduDoc-1.0.0-jwt');

  if (jwtCookie) {
    try {
      const jwtData = JSON.parse(decodeURIComponent(jwtCookie));
      const token = jwtData.token;

      // Clone the request and add the authorization header
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          ...(xsrfToken && { 'X-XSRF-TOKEN': xsrfToken })
        }
      });
    } catch (e) {
      console.error('Error parsing JWT cookie:', e);
    }
  }

  return next(req);
}; 