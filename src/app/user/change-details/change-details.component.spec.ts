import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetailsComponent } from './change-details.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ChangeDetailsComponent', () => {
  let component: ChangeDetailsComponent;
  let fixture: ComponentFixture<ChangeDetailsComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ChangeDetailsComponent>>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    userService = jasmine.createSpyObj('UserService', ['changeNick']);

    await TestBed.configureTestingModule({
      imports: [ChangeDetailsComponent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { userId: '123' } },
        { provide: UserService, useValue: userService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
