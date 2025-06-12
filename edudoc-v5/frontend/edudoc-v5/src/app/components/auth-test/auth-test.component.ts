import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-test.component.html',
  styleUrls: ['./auth-test.component.scss']
})
export class AuthTestComponent implements OnInit {
  publicResult: any = null;
  authenticatedResult: any = null;
  error: string | null = null;
  loading = false;
  currentUser: { name: string, email: string } | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }

  testPublic() {
    this.loading = true;
    this.error = null;
    this.publicResult = null;

    this.authService.testPublicEndpoint().subscribe({
      next: (result) => {
        this.publicResult = result;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error testing public endpoint: ' + err.message;
        this.loading = false;
      }
    });
  }

  testAuthenticated() {
    this.loading = true;
    this.error = null;
    this.authenticatedResult = null;

    this.authService.testAuthenticatedEndpoint().subscribe({
      next: (result) => {
        this.authenticatedResult = result;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error testing authenticated endpoint: ' + err.message;
        this.loading = false;
      }
    });
  }
} 