import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadfilefirebaseComponent } from './uploadfilefirebase.component';

describe('UploadfilefirebaseComponent', () => {
  let component: UploadfilefirebaseComponent;
  let fixture: ComponentFixture<UploadfilefirebaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadfilefirebaseComponent]
    });
    fixture = TestBed.createComponent(UploadfilefirebaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
