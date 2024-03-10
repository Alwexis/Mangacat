import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChapterPage } from './chapter.page';

describe('ChapterPage', () => {
  let component: ChapterPage;
  let fixture: ComponentFixture<ChapterPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ChapterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
