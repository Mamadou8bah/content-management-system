import { Component, HostListener, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormControlName,
  FormGroup,
} from '@angular/forms';
import { ARTICLES } from '../services/articles.data';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-articles-library',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './articles-library.html',
  styleUrl: './articles-library.css',
})
export class ArticlesLibrary {
  articles: any[] = [];
  sourceArticles: any[] = [];
  postForm: any;
  isPosting: boolean = false;


  constructor(private fb: FormBuilder, private elementRef: ElementRef) {
    this.postForm = this.fb.group({
      title: [''],
      content: [''],
    });
  }

  fileToUpload: File | null = null;
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileToUpload = file;
    }
  }

  filterArticles(criteria: string) {
    if (criteria === 'Published' || criteria === 'Draft') {
      this.articles = this.sourceArticles.filter(
        (article) => article.status === criteria
      );
    } else if (criteria === 'Date') {
      this.articles.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else if (criteria === 'Author') {
      this.articles.sort((a, b) => a.publishedBy.localeCompare(b.publishedBy));
    } else {
      this.articles = [...this.sourceArticles];
    }
    console.log('Filtering articles by:', criteria);
  }

  ngOnInit() {
    this.sourceArticles = ARTICLES.map((article) => ({
      ...article,
      isMenuOpen: false,
    }));
    this.articles = [...this.sourceArticles];
  }

  togglePosting() {
    this.isPosting = !this.isPosting;
  }

  openPostMenu(clickedArticle: any) {
    this.articles.forEach((article) => {
      if (article !== clickedArticle) {
        article.isMenuOpen = false;
      }
    });
    clickedArticle.isMenuOpen = !clickedArticle.isMenuOpen;
  }

  closeAllMenus() {
    this.articles.forEach(article => article.isMenuOpen = false);
  }


  onSubmit() {
    if (this.postForm.valid) {
      const formData = new FormData();
      formData.append('title', this.postForm.get('title').value);
      formData.append('content', this.postForm.get('content').value);
      if (this.fileToUpload) {
        formData.append('image', this.fileToUpload, this.fileToUpload.name);
      }
      console.log('Form Data Submitted:', formData);
    }
  }

  deleteArticle(article: any) {
    this.articles = this.articles.filter((a) => a !== article);
  }
  shareArticle(article: any) {
    const shareData = {
      title: article.title,
      text: article.body,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch((error) => console.log('Error sharing', error));
    }
    else {
      console.log('Web Share API not supported in this browser.');
    }
  }

  unpublishArticle(article: any) {
    article.status = 'Draft';
  }
}
