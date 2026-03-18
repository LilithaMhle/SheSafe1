import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface PasswordRules {
  minLength:  boolean;
  hasUpper:   boolean;
  hasNumber:  boolean;
  hasSpecial: boolean;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  // ── Login form fields ───────────────────────────────────────
  email:           string  = '';
  password:        string  = '';
  showPassword:    boolean = false;
  loading:         boolean = false;
  emailFocused:    boolean = false;
  passwordFocused: boolean = false;

  // ── Login password strength ─────────────────────────────────
  strengthScore: number        = 0;
  strengthLabel: string        = '';
  rules: PasswordRules = { minLength: false, hasUpper: false, hasNumber: false, hasSpecial: false };

  // ── Forgot password modal state ─────────────────────────────
  showForgotModal:         boolean = false;
  resetSuccess:            boolean = false;

  resetEmail:              string  = '';
  resetEmailTouched:       boolean = false;
  resetEmailFocused:       boolean = false;

  newPassword:             string  = '';
  confirmPassword:         string  = '';
  showNewPassword:         boolean = false;
  showConfirmPassword:     boolean = false;
  resetLoading:            boolean = false;
  newPasswordFocused:      boolean = false;
  confirmPasswordFocused:  boolean = false;

  // ── Reset password strength ─────────────────────────────────
  newStrengthScore: number        = 0;
  newStrengthLabel: string        = '';
  newRules: PasswordRules = { minLength: false, hasUpper: false, hasNumber: false, hasSpecial: false };

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {}

  // ── Toggle show/hide password ───────────────────────────────
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // ── Email format validation ─────────────────────────────────
  isValidEmail(email: string): boolean {
    // Standard email regex: must have local@domain.tld format
    const pattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email.trim());
  }

  // Triggered on every keystroke in the reset email field
  onResetEmailInput(): void {
    // Show error hint only once user has typed something
    if (this.resetEmail.length > 0) {
      this.resetEmailTouched = true;
    }
  }

  // ── Evaluate password rules & strength score ────────────────
  private evaluatePassword(pwd: string): { rules: PasswordRules; score: number; label: string } {
    const rules: PasswordRules = {
      minLength:  pwd.length >= 8,
      hasUpper:   /[A-Z]/.test(pwd),
      hasNumber:  /[0-9]/.test(pwd),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
    };
    const score = Object.values(rules).filter(Boolean).length;
    const labels: Record<number, string> = { 0:'', 1:'Weak', 2:'Fair', 3:'Good', 4:'Strong' };
    return { rules, score, label: labels[score] ?? '' };
  }

  // Called on login password input
  onPasswordInput(): void {
    const r = this.evaluatePassword(this.password);
    this.rules         = r.rules;
    this.strengthScore = r.score;
    this.strengthLabel = r.label;
  }

  // Called on new password input inside modal
  onNewPasswordInput(): void {
    const r = this.evaluatePassword(this.newPassword);
    this.newRules         = r.rules;
    this.newStrengthScore = r.score;
    this.newStrengthLabel = r.label;
  }

  // ── Login form valid? ───────────────────────────────────────
  isFormValid(): boolean {
    return this.email.trim().length > 0 && this.strengthScore === 4;
  }

  // ── Login submit ─────────────────────────────────────────────
  onLogin(): void {
  if (!this.isFormValid()) return;
  this.loading = true;

  this.http.post<any>('http://localhost:3000/api/login', {
    email:    this.email,
    password: this.password,
  }, { withCredentials: true }).subscribe({
    next: (res) => {
      this.loading = false;
      this.router.navigate(['/home'], { replaceUrl: true });
    },
    error: (err) => {
      this.loading = false;
      alert(err.error?.error || 'Login failed. Please try again.');
    }
  });
}


  // ── Open forgot password modal ───────────────────────────────
  openForgotModal(): void {
    // Reset all modal state
    this.resetEmail             = '';
    this.resetEmailTouched      = false;
    this.newPassword            = '';
    this.confirmPassword        = '';
    this.showNewPassword        = false;
    this.showConfirmPassword    = false;
    this.newStrengthScore       = 0;
    this.newStrengthLabel       = '';
    this.newRules               = { minLength: false, hasUpper: false, hasNumber: false, hasSpecial: false };
    this.resetSuccess           = false;
    this.showForgotModal        = true;
  }

  // Close modal (backdrop tap or Cancel)
  closeForgotModal(): void {
    // Only allow close if not showing success screen
    if (!this.resetSuccess) {
      this.showForgotModal = false;
    }
  }

  // ── Reset form valid? ────────────────────────────────────────
 isResetValid(): boolean {
  return (
    this.isValidEmail(this.resetEmail)        &&
    this.newStrengthScore === 4               &&  // ← requires ALL 4 rules met
    this.newPassword === this.confirmPassword &&
    this.confirmPassword.length > 0
  );
}

  // ── Reset password submit ────────────────────────────────────
 onResetPassword(): void {
  if (!this.isResetValid()) return;
  this.resetLoading = true;

  this.http.post<any>('http://localhost:3000/api/reset-password', {
    email:       this.resetEmail,
    newPassword: this.newPassword,
  }, { withCredentials: true }).subscribe({
    next: () => {
      this.resetLoading = false;
      this.resetSuccess = true;  // shows the success screen
    },
    error: (err) => {
      this.resetLoading = false;
      alert(err.error?.error || 'Reset failed. Make sure your email is correct.');
    }
  });
}

  // ── Back to login from success screen ───────────────────────
  backToLogin(): void {
    this.showForgotModal = false;
    this.resetSuccess    = false;
  }

  // ── Navigate to sign up ──────────────────────────────────────
  goToSignUp(): void {
    this.router.navigate(['/signup']);
  }

}
