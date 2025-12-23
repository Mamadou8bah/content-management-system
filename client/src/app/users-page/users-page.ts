import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { USERS } from '../services/users.data';
import {ROLES} from '../services/roles.data';
import { Users } from '../services/users';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-page.html',
  styleUrl: './users-page.css',
})
export class UsersPage implements OnInit {
  users: any[] = [];
  sourceUsers: any[] = [];
  roles = ROLES;
  userRole=localStorage.getItem('cms_role');
  errorMessage: string = '';
  searchTerm: string = '';
  roleFilter: string = '';

  constructor(private usersService: Users) {}

  ngOnInit() {
    
    this.getUsers().subscribe({
      next: (users) => {
        this.sourceUsers = users.map(user => ({ ...user, isMenuOpen: false }));
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.errorMessage = 'Failed to load users. ' + (err.error?.message || err.message);
      }
    });
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement)?.value ?? '';
    this.searchTerm = value;
    this.applyFilters();
  }

  onRoleFilter(event: Event) {
    const value = (event.target as HTMLSelectElement)?.value ?? '';
    this.roleFilter = value;
    this.applyFilters();
  }

  private normalizeRole(value: string): string {
    return (value ?? '').replace(/\s+/g, '').toLowerCase();
  }

  private applyFilters() {
    const term = (this.searchTerm ?? '').trim().toLowerCase();
    const role = this.normalizeRole(this.roleFilter);

    this.users = this.sourceUsers.filter((user) => {
      const name = (user.fullname ?? '').toLowerCase();
      const email = (user.email ?? '').toLowerCase();
      const matchesText = !term || name.includes(term) || email.includes(term);

      const userRoleName = this.normalizeRole(user.roleId?.name ?? '');
      const matchesRole = !role || userRoleName === role;

      return matchesText && matchesRole;
    });
  }

  openUserMenu(clickedUser: any) {
    this.users.forEach((user) => {
      if (user !== clickedUser) {
        user.isMenuOpen = false;
      }
    });
    clickedUser.isMenuOpen = !clickedUser.isMenuOpen;
  }
    
   updateRole(user: any, newRole: string) {
   
    const apiRoleName = newRole.replace(/\s+/g, '');

    if (user.roleId) {
      user.roleId = { ...user.roleId, name: newRole };
    }
    user.isMenuOpen = false;
    console.log(`${user.fullname} is now a ${newRole}`);

    this.usersService.updateUser(user._id, { role: apiRoleName }).subscribe({
      next: (response) => {
        const updated = response?.user ?? response;
        if (updated?.roleId) {
          user.roleId = updated.roleId;
        }
        this.applyFilters();
        console.log('User role updated on server:', response);
      },
      error: (err) => {
        console.error('Error updating user role:', err);
        this.errorMessage = 'Failed to update user role. ' + (err.error?.error || err.message);
      }
    });
  } 

  getUsers(): Observable<any[]> {
    return this.usersService.getUsers();
  }

  deleteUser(user: any) {
    this.sourceUsers = this.sourceUsers.filter((u) => u._id !== user._id);
    this.applyFilters();
  }

  shareUser(user: any) {
    const shareData = {
      title: user.fullname,
      text: `Check out the profile of ${user.fullname}, a ${user.roleId?.name ?? 'User'}.`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.log('Error sharing', err));
    } else {
      alert('Web Share API not supported. URL copied to console.');
    }
  }
}