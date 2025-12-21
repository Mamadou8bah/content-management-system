import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { USERS } from '../services/users.data';
import {ROLES} from '../services/roles.data';

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

  constructor() {}

  ngOnInit() {
    
    this.users = USERS.map(user => ({ ...user, isMenuOpen: false }));
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