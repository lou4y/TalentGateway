import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInternshipsComponent } from './list-internships.component';

describe('ListInternshipsComponent', () => {
  let component: ListInternshipsComponent;
  let fixture: ComponentFixture<ListInternshipsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListInternshipsComponent]
    });
    fixture = TestBed.createComponent(ListInternshipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
