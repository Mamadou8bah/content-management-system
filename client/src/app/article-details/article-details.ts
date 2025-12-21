import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ARTICLES } from '../services/articles.data';

@Component({
  selector: 'app-article-details',
  standalone: true, // Required for Angular 17+
  imports: [CommonModule],
  templateUrl: './article-details.html',
  styleUrl: './article-details.css',
})
export class ArticleDetails implements OnInit {
  article: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // 1. Get the ID from the route
    const idParam = this.route.snapshot.paramMap.get('id');
    
    // 2. Convert string ID to number and find the article
    if (idParam) {
      this.article = ARTICLES.find(a => a.id == idParam);
    }
    
    // Debugging: Check the console to see what's happening
    console.log('ID from URL:', idParam);
    console.log('Found Article:', this.article);
  }
}