import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  userRole: string | null = localStorage.getItem('userRole');

  isSuperAdmin(): boolean {
    return this.userRole === 'SuperAdmin';
  }

  isManager(): boolean {
    return this.userRole === 'Manager';
  }
  isContributor(): boolean {
    return this.userRole === 'Contributor';
  }
}
