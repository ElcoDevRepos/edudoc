import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private cookieService: CookieService
  ) { }



  getCurrentUser(): { name: string, email: string } | null {
    const jwtCookie = this.cookieService.get('EduDoc-1.0.0-jwt');

    if (jwtCookie) {
      try {
        const jwtData = JSON.parse(decodeURIComponent(jwtCookie));
        return {
          name: jwtData.name,
          email: jwtData.email
        };
      } catch (e) {
        console.error('Error parsing JWT cookie:', e);
        return null;
      }
    }
    return null;
  }
} 