import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Login } from '../services/login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  isLoginMode = true;
  profileImage: string | ArrayBuffer | null = null;
  form: FormGroup;

  errorMessage: string = '';
  constructor(
    private fb: FormBuilder,
    private loginService: Login,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: [''],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.form.reset();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.profileImage = reader.result);
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.isLoginMode ? this.login() : this.register();
  }

  login() {
    this.loginService.loginUser(this.form.value).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        localStorage.setItem('cms_access_token', response.accessToken);
        localStorage.setItem('cms_refresh_token', response.refreshToken);
        localStorage.setItem('cms_role', response.role);
        localStorage.setItem('cms_fullname', response.fullname);
        localStorage.setItem('cms_profilePhotoUrl', response.profilePhotoUrl);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error?.error || 'An error occurred during login.';
      }
    });
  }

  register() {
    const formData = new FormData();
    formData.append('fullname', this.form.value.username);
    formData.append('password', this.form.value.password);
    formData.append('email', this.form.value.email);

    if (this.profileImage && typeof this.profileImage === 'string') {
      const blob = this.dataURLtoBlob(this.profileImage);
      formData.append('avatar', blob, 'profile.png'); 
    }

    this.loginService.registerUser(formData).subscribe({
      next: () => (this.isLoginMode = true),
      error: (err) => {
        console.error(err);
        this.errorMessage = err.error?.error || 'An error occurred during registration.';
      }
    });
    alert('Registration successful! Please log in.');
  }

  private dataURLtoBlob(dataURL: string): Blob {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }
}