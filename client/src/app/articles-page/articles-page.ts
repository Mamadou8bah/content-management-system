import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ARTICLES } from '../services/articles.data';
import { RouterLink } from "@angular/router";
import { ArticlesService } from '../services/articles.service';

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
  userRole=localStorage.getItem('cms_role');

  loading = true;

  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private elementRef: ElementRef, private articlesService: ArticlesService) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.articlesService.getArticles().subscribe({
      next: (articles: any[]) => {
        this.articles = articles.filter((a) => a.status === 'published').map((article) => ({ ...article, isMenuOpen: false }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closeAllPostMenus();
    }
  }

  isViewer(): boolean{
    return this.userRole === 'Viewer';
  }
  isContributor():boolean{
    return this.userRole === 'Contributor';
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

  deleteArticle(article: any, event?: MouseEvent) {
    event?.stopPropagation();
    this.closeAllPostMenus();

    const ok = confirm('Are you sure you want to delete this article?');
    if (!ok) return;

    this.articlesService.softDeleteArticle(article._id).subscribe({
      next: () => {
        this.articles = this.articles.filter((a) => a._id !== article._id);
      },
      error: (err) => {
        console.error('Error deleting article', err);
      },
    });
  }

  unpublishArticle(article: any, event?: MouseEvent) {
    event?.stopPropagation();
    this.closeAllPostMenus();

    this.articlesService.unpublishArticle(article._id).subscribe({
      next: () => {
        // This page only shows published articles; once unpublished it should disappear.
        this.articles = this.articles.filter((a) => a._id !== article._id);
      },
      error: (err) => {
        console.error('Error unpublishing article', err);
      },
    });
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
 
  getArticles():any {
    return this.articlesService.getArticles();
  }
  onSubmit() {
    if (this.postForm.valid) {
      const formData = new FormData();
      formData.append('title', this.postForm.value.title);
      formData.append('content', this.postForm.value.content);
      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }

   

      this.articlesService.postArticle(formData).subscribe({
        next: (response) => {
          console.log('Article posted successfully', response);
          
          this.togglePosting(); 
           this.postForm.reset();
        },
        error: (err) => {
          console.error('Error posting article', err);
        }
      });

   
      
    } else {
      console.log('Form invalid or no file selected');
    }
  }
}
