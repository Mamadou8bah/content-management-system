import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesPage } from './roles-page';

describe('RolesPage', () => {
  let component: RolesPage;
  let fixture: ComponentFixture<RolesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
