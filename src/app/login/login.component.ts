import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import type { ConfirmationResult } from 'firebase/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginMode: 'google' | 'phone' = 'google';
  phoneForm!: FormGroup;
  otpForm!: FormGroup;
  confirmationResult?: ConfirmationResult;
  isSendingOtp = false;
  isVerifyingOtp = false;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.phoneForm = this.fb.group({
      phone: ['+91', [Validators.required, Validators.pattern(/^\+\d{10,15}$/)]]
    });

    this.otpForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]]
    });
  }

  selectMode(mode: 'google' | 'phone'): void {
    this.loginMode = mode;
    this.errorMessage = '';
    this.successMessage = '';
  }

  async signInWithGoogle(): Promise<void> {
    this.errorMessage = '';
    this.isSendingOtp = true;

    try {
      await this.authService.signInWithGoogle();
      this.successMessage = 'Signed in successfully with Google.';
      await this.router.navigate(['/']);
    } catch (error) {
      this.errorMessage = 'Google sign-in failed. Please try again.';
      console.error(error);
    } finally {
      this.isSendingOtp = false;
    }
  }

  async sendOtp(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.phoneForm.invalid) {
      this.errorMessage = 'Enter a valid phone number in E.164 format, for example +919876543210.';
      return;
    }

    this.isSendingOtp = true;

    try {
      const phoneNumber = this.phoneForm.value.phone as string;
      this.confirmationResult = await this.authService.sendOtp(phoneNumber);
      this.successMessage = 'OTP sent. Enter the code below to verify.';
    } catch (error) {
      this.errorMessage = 'Unable to send OTP. Please check your number and try again.';
      console.error(error);
    } finally {
      this.isSendingOtp = false;
    }
  }

  async verifyOtp(): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.confirmationResult) {
      this.errorMessage = 'Please request an OTP first.';
      return;
    }

    if (this.otpForm.invalid) {
      this.errorMessage = 'Enter the full OTP sent to your phone.';
      return;
    }

    this.isVerifyingOtp = true;

    try {
      await this.authService.verifyOtp(this.confirmationResult, this.otpForm.value.code as string);
      this.successMessage = 'Mobile number verified and signed in successfully.';
      await this.router.navigate(['/']);
    } catch (error) {
      this.errorMessage = 'OTP verification failed. Please try again.';
      console.error(error);
    } finally {
      this.isVerifyingOtp = false;
    }
  }
}
