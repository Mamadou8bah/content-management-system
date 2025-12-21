import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  isLoginMode = true;
  profileImage: string | ArrayBuffer | null = null;

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.profileImage = reader.result);
      reader.readAsDataURL(file);
    }
  }
}