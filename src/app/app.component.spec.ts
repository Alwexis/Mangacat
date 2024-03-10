import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  it('should create the app', () => {
    TestBed.overrideComponent(AppComponent, {
      add: {
        imports: [RouterTestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }
    });
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
