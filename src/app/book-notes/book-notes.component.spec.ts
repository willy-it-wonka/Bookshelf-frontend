import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookNotesComponent } from './book-notes.component';

describe('BookNotesComponent', () => {
  let component: BookNotesComponent;
  let fixture: ComponentFixture<BookNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookNotesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
