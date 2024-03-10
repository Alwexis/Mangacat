import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunityPage } from './comunity.page';

describe('ComunityPage', () => {
  let component: ComunityPage;
  let fixture: ComponentFixture<ComunityPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(ComunityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
