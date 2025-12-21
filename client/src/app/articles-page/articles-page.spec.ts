import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesPage } from './articles-page';

describe('ArticlesPage', () => {
  let component: ArticlesPage;
  let fixture: ComponentFixture<ArticlesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticlesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticlesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
