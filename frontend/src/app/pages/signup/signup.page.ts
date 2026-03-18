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
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false,
})
export class SignupPage implements OnInit {

  // ── Form fields ─────────────────────────────────────────────
  firstName:       string  = '';
  lastName:        string  = '';
  email:           string  = '';
  password:        string  = '';
  confirmPassword: string  = '';

  // ── UI state ─────────────────────────────────────────────────
  showPassword:    boolean = false;
  showConfirm:     boolean = false;
  loading:         boolean = false;
  signUpSuccess:   boolean = false;

  // ── Focus tracking ───────────────────────────────────────────
  firstNameFocused: boolean = false;
  lastNameFocused:  boolean = false;
  emailFocused:     boolean = false;
  passwordFocused:  boolean = false;
  confirmFocused:   boolean = false;

  // ── Email touched (to delay showing error until user types) ──
  emailTouched: boolean = false;

  // ── Password strength ────────────────────────────────────────
  strengthScore: number       = 0;
  strengthLabel: string       = '';
  rules: PasswordRules = { minLength: false, hasUpper: false, hasNumber: false, hasSpecial: false };

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {}

  // ── Email format validation ───────────────────────────────────
  isValidEmail(email: string): boolean {
    const pattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email.trim());
  }

  onEmailInput(): void {
    if (this.email.length > 0) {
      this.emailTouched = true;
    }
  }

  // ── Password strength evaluator ───────────────────────────────
  private evaluatePassword(pwd: string): { rules: PasswordRules; score: number; label: string } {
    const rules: PasswordRules = {
      minLength:  pwd.length >= 8,
      hasUpper:   /[A-Z]/.test(pwd),
      hasNumber:  /[0-9]/.test(pwd),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
    };
    const score = Object.values(rules).filter(Boolean).length;
    const labels: Record<number, string> = { 0: '', 1: 'Weak', 2: 'Fair', 3: 'Good', 4: 'Strong' };
    return { rules, score, label: labels[score] ?? '' };
  }

  onPasswordInput(): void {
    const r = this.evaluatePassword(this.password);
    this.rules         = r.rules;
    this.strengthScore = r.score;
    this.strengthLabel = r.label;
  }

  // ── Overall form validity ─────────────────────────────────────
  isFormValid(): boolean {
    return (
      this.firstName.trim().length > 0        &&
      this.lastName.trim().length > 0         &&
      this.isValidEmail(this.email)           &&
      this.strengthScore === 4                &&
      this.password === this.confirmPassword  &&
      this.confirmPassword.length > 0
    );
  }

  // ── Sign up submit ────────────────────────────────────────────
 onSignUp(): void {
  if (!this.isFormValid()) return;
  this.loading = true;

  this.http.post<any>('http://localhost:3000/api/register', {
    firstName: this.firstName,
    lastName:  this.lastName,
    email:     this.email,
    password:  this.password,
  }, { withCredentials: true }).subscribe({
    next: (res) => {
      this.loading       = false;
      this.signUpSuccess = true;   // shows the success screen
    },
    error: (err) => {
      this.loading = false;
      alert(err.error?.error || 'Sign up failed. Please try again.');
    }
  });
}


  // ── Navigate to login ─────────────────────────────────────────
  goToLogin(): void {
    this.router.navigate(['/login'], { replaceUrl: true });
  }

}
