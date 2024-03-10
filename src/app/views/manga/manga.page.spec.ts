import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MangaPage } from './manga.page';

describe('MangaPage', () => {
  let component: MangaPage;
  let fixture: ComponentFixture<MangaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MangaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
