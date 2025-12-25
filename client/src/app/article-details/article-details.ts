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
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private articlesService: ArticlesService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.notFound = true;
      this.loading = false;
      return;
    }
    console.log(id);
    console.log('Fetching article details for ID:', id);
    this.articlesService.getArticleById(id).subscribe({
      next: (article) => {
        if (!article || article.isDeleted === true) {
          this.notFound = true;
          console.log('Article not found or is deleted');
          this.loading = false;
          return;
        }
        this.article = {
          ...article,
          title: article.title,
          imageUrl: article.imageUrl,
          publishedBy:   article.author?.fullname || 'Unknown',
          body: article.content || article.body
        };
        this.loading = false;
      },
      error: () => {
        this.notFound = true;
        console.log('Error fetching article');
        this.loading = false;
      }
    });
  }
}
