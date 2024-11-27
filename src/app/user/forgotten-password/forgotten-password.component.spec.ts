import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgottenPasswordComponent } from './forgotten-password.component';
import { UserService } from '../user.service';
import { MatDialogRef } from '@angular/material/dialog';

describe('ForgottenPasswordComponent', () => {
  let component: ForgottenPasswordComponent;
  let fixture: ComponentFixture<ForgottenPasswordComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<ForgottenPasswordComponent>>;

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    userService = jasmine.createSpyObj('UserService', [
      'initiateForgottenPasswordReset',
    ]);

    await TestBed.configureTestingModule({
      imports: [ForgottenPasswordComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: UserService, useValue: userService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgottenPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
