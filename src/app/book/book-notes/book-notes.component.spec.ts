import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookNotesComponent } from './book-notes.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('BookNotesComponent', () => {
  let component: BookNotesComponent;
  let fixture: ComponentFixture<BookNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookNotesComponent, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: 'test-id' } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BookNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
