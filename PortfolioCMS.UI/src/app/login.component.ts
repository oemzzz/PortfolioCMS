import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div style="background: #f1f1f1; padding: 20px; border-radius: 5px; max-width: 400px; margin: 40px auto;">
      <h2 style="text-align: center;">🔐 Admin Girişi</h2>
      <input type="text" [(ngModel)]="username" placeholder="Kullanıcı Adı" style="display:block; width:100%; margin-bottom:10px; padding:8px; box-sizing: border-box;" />
      <input type="password" [(ngModel)]="password" placeholder="Şifre" style="display:block; width:100%; margin-bottom:15px; padding:8px; box-sizing: border-box;" />
      <button (click)="onLogin()" style="width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Giriş Yap</button>
      @if (loginError) { <p style="color: red; margin-top: 10px; text-align: center;">{{ loginError }}</p> }
    </div>
  `
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