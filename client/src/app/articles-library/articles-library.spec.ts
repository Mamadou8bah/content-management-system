import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesLibrary } from './articles-library';

describe('ArticlesLibrary', () => {
  let component: ArticlesLibrary;
  let fixture: ComponentFixture<ArticlesLibrary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticlesLibrary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticlesLibrary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
