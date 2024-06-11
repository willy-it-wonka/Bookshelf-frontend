import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { UserService } from '../user.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let userData: { email: string; password: string };

  beforeEach(async () => {
    userService = jasmine.createSpyObj('UserService', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, NoopAnimationsModule],
      providers: [{ provide: UserService, useValue: userService }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    userData = { email: 'test@example.com', password: '123' };
    component.email = userData.email;
    component.password = userData.password;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call signIn() when onSubmit() is called', () => {
    spyOn(component, 'signIn'); // Mocking signIn().
    component.onSubmit();
    expect(component.signIn).toHaveBeenCalled();
  });

  it('should handle successful login and redirect to bookshelf', () => {
    const response = { message: 'test_token', status: true };
    userService.login.and.returnValue(of(response)); // Mocking login() from UserService
    spyOn(component, 'goToBookshelf'); // Mocking goToBookshelf().

    component.signIn();

    expect(userService.login).toHaveBeenCalledWith(userData);
    expect(localStorage.getItem('jwt')).toEqual('test_token');
    expect(component.goToBookshelf).toHaveBeenCalled();
  });

  it('should handle unsuccessful login', () => {
    const response = { message: 'error message', status: false };
    userService.login.and.returnValue(of(response));

    component.signIn();

    expect(userService.login).toHaveBeenCalledWith(userData);
  });
});
