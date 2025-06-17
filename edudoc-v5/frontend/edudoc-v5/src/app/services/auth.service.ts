import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';

export interface TestResponse {
  message: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/TestAuth`;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  testPublicEndpoint(): Observable<TestResponse> {
    return this.http.get<TestResponse>(`${this.baseUrl}/public`);
  }

  testAuthenticatedEndpoint(): Observable<TestResponse> {
    return this.http.get<TestResponse>(`${this.baseUrl}/authenticated`);
  }

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