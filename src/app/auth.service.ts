import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { Auth, getAuth, signInWithPopup, GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult, UserCredential } from 'firebase/auth';
import { firebaseConfig } from './firebase.config';

const app = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private provider = new GoogleAuthProvider();

  async signInWithGoogle(): Promise<UserCredential> {
    return signInWithPopup(auth, this.provider);
  }

  async setupRecaptcha(containerId = 'recaptcha-container'): Promise<RecaptchaVerifier> {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth as any,
        containerId as any,
        {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved, allow verification to continue
          }
        } as any
      );
      await window.recaptchaVerifier.render();
    }

    return window.recaptchaVerifier;
  }

  async sendOtp(phoneNumber: string): Promise<ConfirmationResult> {
    const verifier = await this.setupRecaptcha();
    return signInWithPhoneNumber(auth, phoneNumber, verifier);
  }

  async verifyOtp(confirmationResult: ConfirmationResult, otp: string): Promise<UserCredential> {
    return confirmationResult.confirm(otp);
  }
}
