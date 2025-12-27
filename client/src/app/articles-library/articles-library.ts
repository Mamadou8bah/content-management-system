import { Component, HostListener, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormControlName,
  FormGroup,
} from '@angular/forms';
import { ARTICLES } from '../services/articles.data';

import { ArticlesService } from '../services/articles.service';
import { RouterLink } from "@angular/router";
import { Observable } from 'rxjs';

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
  searchTerm: string = '';
  filterOption: string = '';

  loading = true;
  postingLoader = false;

  isEditing: boolean = false;
  editingArticle: any = null;


  constructor(private fb: FormBuilder, private elementRef: ElementRef, private articleService:ArticlesService) {
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

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement)?.value ?? '';
    this.searchTerm = value;
    this.applyFilters();
  }

  onFilterChange(event: Event) {
    const value = (event.target as HTMLSelectElement)?.value ?? '';
    this.filterOption = value;
    this.applyFilters();
  }

  private applyFilters() {
    const term = (this.searchTerm ?? '').trim().toLowerCase();
    const currentUserRole = localStorage.getItem('cms_role');
    const currentUserId = localStorage.getItem('cms_userId');

    let filtered = this.sourceArticles.filter((article) => {
      // Only show contributor's own articles
      if (currentUserRole === 'Contributor' && article.author?._id !== currentUserId) {
        return false;
      }
      if (!term) return true;
      const title = (article.title ?? '').toLowerCase();
      const author = (article.author?.fullname ?? '').toLowerCase();
      return title.includes(term) || author.includes(term);
    });

    if (this.filterOption === 'date') {
      filtered = [...filtered].sort((a, b) => {
        const aDate = new Date(a.createdAt ?? a.updatedAt ?? 0).getTime();
        const bDate = new Date(b.createdAt ?? b.updatedAt ?? 0).getTime();
        return bDate - aDate;
      });
    } else if (this.filterOption === 'author') {
      filtered = [...filtered].sort((a, b) => {
        const aName = (a.author?.fullname ?? '').toLowerCase();
        const bName = (b.author?.fullname ?? '').toLowerCase();
        return aName.localeCompare(bName);
      });
    }

    this.articles = filtered;
  }

  ngOnInit() {
    this.articleService.getArticles().subscribe({
      next: (a: any[]) => {
        this.sourceArticles = a.map((article) => ({
          ...article,
          isMenuOpen: false,
        }));
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  togglePosting() {
    this.isPosting = !this.isPosting;
    if (this.isPosting) {
      this.isEditing = false;
      this.editingArticle = null;
      this.postForm.reset();
      this.fileToUpload = null;
    }
  }

  startEditArticle(article: any) {
    this.isEditing = true;
    this.isPosting = true;
    this.editingArticle = article;
    this.postForm.patchValue({
      title: article.title,
      content: article.content || article.body || ''
    });
    this.fileToUpload = null;
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

  getArticles(): Observable<any>{
    return this.articleService.getArticles();
  }

  onSubmit() {
    if (!this.postForm.valid) return;
    this.postingLoader = true;
    const { title, content } = this.postForm.value;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (this.fileToUpload) {
      formData.append('image', this.fileToUpload, this.fileToUpload.name);
    }

    if (this.isEditing && this.editingArticle) {
      // Edit existing article
      this.articleService.updateArticle(this.editingArticle._id, formData).subscribe({
        next: (response) => {
          const updated = response?.article ?? response;
          // Update in sourceArticles
          const idx = this.sourceArticles.findIndex(a => a._id === this.editingArticle._id);
          if (idx !== -1) {
            this.sourceArticles[idx] = { ...this.sourceArticles[idx], ...updated, isMenuOpen: false };
          }
          this.applyFilters();
          this.isPosting = false;
          this.isEditing = false;
          this.editingArticle = null;
          this.postForm.reset();
          this.fileToUpload = null;
          this.postingLoader = false;
        },
        error: (err) => {
          console.error('Error updating article', err);
          this.postingLoader = false;
        }
      });
    } else {
      // Create new article
      this.articleService.postArticle(formData).subscribe({
        next: (response) => {
          const created = response?.article ?? response;
          const newArticle = { ...created, isMenuOpen: false };
          this.sourceArticles.unshift(newArticle);
          this.applyFilters();
          this.isPosting = false;
          this.postForm.reset();
          this.fileToUpload = null;
          this.postingLoader = false;
        },
        error: (err) => {
          console.error('Error posting article', err);
          this.postingLoader = false;
        }
      });
    }
  }

  deleteArticle(article: any) {
    this.articleService.softDeleteArticle(article._id).subscribe({
      next: () => {
        this.articles = this.articles.filter((a) => a._id !== article._id);
        this.sourceArticles = this.sourceArticles.filter((a) => a._id !== article._id);
      },
      error: (err) => {
        console.error('Failed to delete article', err);
        // Optionally show a notification to the user
      }
    });
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
    article.status = 'draft';
    this.updateArticle(article, { status: 'draft' });
  }
  publishArticle(article: any) {
    article.status = 'published';
    this.updateArticle(article, { status: 'published' });
  }
  updateArticle(article: any, updates: any) {
    Object.assign(article, updates);
    return this.articleService.updateArticle(article._id, updates).subscribe();
  }

  canPublishOrUnpublish(): boolean {
    const userRole = localStorage.getItem('cms_role');
    return userRole === 'SuperAdmin' || userRole === 'Manager';
  }
}
