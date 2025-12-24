import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ArticlesService } from '../services/articles.service';

@Component({
  selector: 'app-article-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article-details.html',
  styleUrl: './article-details.css',
})
export class ArticleDetails implements OnInit {
  article: any;

  constructor(
    private route: ActivatedRoute,
    private articlesService: ArticlesService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.articlesService.getArticles().subscribe({
      next: (articles) => {
        this.article = articles.find((a: any) => a.id == id);
      },
      error: (err) => {
        console.error('Failed to load articles', err);
      }
    });
  }
}
