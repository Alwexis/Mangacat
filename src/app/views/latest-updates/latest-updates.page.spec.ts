import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LatestUpdatesPage } from './latest-updates.page';

describe('LatestUpdatesPage', () => {
  let component: LatestUpdatesPage;
  let fixture: ComponentFixture<LatestUpdatesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LatestUpdatesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
