import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav style="background: #333; padding: 15px; color: white; display: flex; gap: 15px;">
      <a routerLink="/" style="color: white; text-decoration: none; font-weight: bold;">🏠 Portföy</a>
      <a routerLink="/admin" style="color: white; text-decoration: none; font-weight: bold;">⚙️ Admin Paneli</a>
    </nav>
    <div style="padding: 20px; font-family: sans-serif; max-width: 800px; margin: auto;">
      <router-outlet></router-outlet> <!-- Hangi sayfadaysak bileşen burada render edilecek -->
    </div>
  `
})
export class App {}