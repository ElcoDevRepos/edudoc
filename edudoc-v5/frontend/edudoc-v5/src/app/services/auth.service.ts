import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://localhost:7118/api/TestAuth'; // Adjust this to match your backend URL

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  testPublicEndpoint(): Observable<any> {
    return this.http.get(`${this.baseUrl}/public`);
  }

  testAuthenticatedEndpoint(): Observable<any> {
    return this.http.get(`${this.baseUrl}/authenticated`);
  }

  getCurrentUser(): { name: string, email: string } | null {
    const jwtCookie = this.cookieService.get('Edu-Doc 4.0 ©-1.0.0-jwt');

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