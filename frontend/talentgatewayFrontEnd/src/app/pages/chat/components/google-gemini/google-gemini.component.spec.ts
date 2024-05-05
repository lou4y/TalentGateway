import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleGeminiComponent } from './google-gemini.component';

describe('GoogleGeminiComponent', () => {
  let component: GoogleGeminiComponent;
  let fixture: ComponentFixture<GoogleGeminiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoogleGeminiComponent]
    });
    fixture = TestBed.createComponent(GoogleGeminiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
