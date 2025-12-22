import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
}) 
export class App {
  isSidebarOpen = signal(true);
  isLoginPage = signal(false);
  fullname = localStorage.getItem('cms_fullname') || 'User';
  profilePhotoUrl = localStorage.getItem('cms_profilePhotoUrl') || 'https://static.vecteezy.com/system/resources/thumbnails/074/189/886/small/an'

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.isLoginPage.set(event.urlAfterRedirects === '/login');
        if (this.isLoginPage()) {
          this.isSidebarOpen.set(false);
        } else {
          this.isSidebarOpen.set(true);
        }
      });
  }

  toggleSidebar() {
    this.isSidebarOpen.set(!this.isSidebarOpen());
  }
}
