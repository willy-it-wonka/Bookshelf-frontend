import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordResetComponent } from './password-reset.component';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('PasswordResetComponent', () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userService = jasmine.createSpyObj('UserService', [
      'resetForgottenPassword',
    ]);
    const activatedRouteMock = {
      queryParams: of({ token: '123' }),
    };

    await TestBed.configureTestingModule({
      imports: [PasswordResetComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: UserService, useValue: userService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
