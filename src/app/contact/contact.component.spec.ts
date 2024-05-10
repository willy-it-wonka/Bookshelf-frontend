import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactComponent } from './contact.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent, ReactiveFormsModule, NgxCaptchaModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the form initialized with empty fields', () => {
    const formGroup = component.formGroup;
    expect(formGroup.valid).toBeFalsy(); // Form shouldn't be valid initially.
    expect(formGroup.controls['from_email'].value).toEqual('');
    expect(formGroup.controls['from_name'].value).toEqual('');
    expect(formGroup.controls['subject'].value).toEqual('');
    expect(formGroup.controls['message'].value).toEqual('');
  });

  it('should call emailjs.send when sendEmail() is called', async () => {
    const mockResponse: EmailJSResponseStatus = { status: 200, text: 'OK' }; // Mocking response from EmailJS.
    spyOn(emailjs, 'send').and.returnValue(Promise.resolve(mockResponse));
    spyOn(component.formGroup, 'reset');

    await component.sendEmail();

    expect(emailjs.send).toHaveBeenCalled();
    expect(component.formGroup.reset).toHaveBeenCalled();
  });

  it('should set isCaptchaResolved to true when captcha is resolved', () => {
    const resolvedValue = true;
    component.onCaptchaResolved(resolvedValue);
    expect(component.isCaptchaResolved).toBeTruthy();
  });
});
