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
  article: any = null;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private articlesService: ArticlesService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.notFound = true;
      return;
    }
    this.articlesService.getArticleById(id).subscribe({
      next: (article) => {
        if (!article || article.isDeleted) {
          this.notFound = true;
          return;
        }
        this.article = {
          ...article,
          title: article.title,
          imageUrl: article.imageUrl,
          publishedBy: article.publishedBy?.name || article.author?.name || 'Unknown',
          body: article.content || article.body
        };
      },
      error: () => {
        this.notFound = true;
      }
    });
  }
}
