import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from './core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username = ''; password = ''; loginError = '';
  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  onLogin(): void {
    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => this.router.navigate(['/admin']), // Başarılıysa admin paneline yönlendir
      error: (err) => { this.loginError = err.error?.message || 'Giriş başarısız.'; this.cdr.detectChanges(); }
    });
  }
}