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
  roles = ROLES;
  errorMessage: string = '';

  constructor(private usersService: Users) {}

  ngOnInit() {
    
    this.getUsers().subscribe({
      next: (users) => {
        this.users = users.map(user => ({ ...user, isMenuOpen: false }));
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.errorMessage = 'Failed to load users. ' + (err.error?.message || err.message);
      }
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
    user.rollname = newRole;
    user.isMenuOpen = false;
    console.log(`${user.fullname} is now a ${newRole}`);
  }

  getUsers(): Observable<any[]> {
    return this.usersService.getUsers();
  }

  deleteUser(user: any) {
    this.users = this.users.filter((u) => u.id !== user.id);
  }

  shareUser(user: any) {
    const shareData = {
      title: user.fullname,
      text: `Check out the profile of ${user.fullname}, a ${user.rollname}.`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch((err) => console.log('Error sharing', err));
    } else {
      alert('Web Share API not supported. URL copied to console.');
    }
  }
}