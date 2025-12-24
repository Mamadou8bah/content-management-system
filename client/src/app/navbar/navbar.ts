import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Login } from '../services/login';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Input() visible: boolean = true;
  userRole: string | null = localStorage.getItem('cms_role');

  constructor(private router: Router, private loginService: Login) {

  }

  isSuperAdmin(): boolean {
    return this.userRole === 'SuperAdmin';
  }

  isManager(): boolean {
    return this.userRole === 'Manager'; 
  }
  isContributor(): boolean {
    return this.userRole === 'Contributor';
  }

  logout():void {
    this.loginService.logoutUser().subscribe({
      next: () => {
        console.log('Logout successful');
        this.clearSessionAndRedirect(); 
      },
      error: (err) => {
        console.error('Logout failed', err);
      }
    });

  }

  private clearSessionAndRedirect() {
    localStorage.removeItem('cms_role');
    localStorage.removeItem('cms_access_token');
    localStorage.removeItem('cms_refresh_token');
    this.router.navigate(['/login']);
  }
}