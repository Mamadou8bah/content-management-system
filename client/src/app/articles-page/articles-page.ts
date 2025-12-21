import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ARTICLES } from '../services/articles.data';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-articles-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './articles-page.html',
  styleUrls: ['./articles-page.css'],
})
export class ArticlesPage implements OnInit {
  articles: any[] = [];
  postForm: any;
  isPosting: boolean = false;

  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private elementRef: ElementRef) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.articles = ARTICLES.map((article) => ({ ...article, isMenuOpen: false }));
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closeAllPostMenus();
    }
  }

  closeAllPostMenus() {
    this.articles.forEach((article) => {
      article.isMenuOpen = false;
    });
  }

  openPostMenu(clickedArticle: any, event: MouseEvent) {
    event.stopPropagation();
    const wasOpen = clickedArticle.isMenuOpen;
    this.closeAllPostMenus();
    clickedArticle.isMenuOpen = !wasOpen;
  }

  shareArticle(article: any) {
    const shareData = {
      title: article.title,
      text: article.body,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch((error) => console.log('Error sharing', error));
    } else {
      console.log('Web Share API not supported in this browser.');
    }
  }
  unpublishArticle(article: any) {
    article.status = 'Draft';
    article.isMenuOpen = false;
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  togglePosting() {
    this.isPosting = !this.isPosting;
  }
  // Handle form submission
  onSubmit() {
    if (this.postForm.valid) {
      const formData = new FormData();
      formData.append('title', this.postForm.value.title);
      formData.append('content', this.postForm.value.content);
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      console.log('Form data ready to send:', formData);

      this.togglePosting();
      // send formData to backend using HttpClient
    } else {
      console.log('Form invalid or no file selected');
    }
  }
}
