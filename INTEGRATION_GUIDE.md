# 🔗 SheSafe — Frontend ↔ Backend Integration Guide
## Sprint 1 | How to connect the Ionic frontend to the Node.js backend

---

## 📁 Project Structure on GitHub

```
SheSafe-main/
├── frontend/          ← Your team's Ionic/Angular app (already done)
├── backend/           ← This folder (the products database + API)
└── INTEGRATION_GUIDE.md
```

---

## 🚀 Step 1 — Run the Backend (everyone does this)

### 1a. Set up the database
1. Open **MySQL Workbench**
2. Open `backend/database.sql`
3. Press **Ctrl + Shift + Enter** to run it
4. You should see `shesafe` appear in the left panel

### 1b. Set your MySQL password
Open `backend/config/db.js` and update line 6:
```js
password: 'YOUR_PASSWORD_HERE',
```
Leave as `''` if you have no MySQL password.

### 1c. Start the backend
```bash
cd backend
npm install
npm start
```
You should see:
```
✅  SheSafe Backend is running!
   API URL  → http://localhost:3000
```

### 1d. Start the frontend (separate terminal)
```bash
cd frontend
npm install
ionic serve
```
Frontend runs at → **http://localhost:8100**

---

## 🔧 Step 2 — Connect Login Page to Real API

> **File to edit:** `frontend/src/app/pages/login/login.page.ts`

### 2a. Add HttpClient import at the top of the file

Find this line at the top:
```typescript
import { Router } from '@angular/router';
```
Replace it with:
```typescript
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
```

### 2b. Update the constructor

Find:
```typescript
constructor(private router: Router) {}
```
Replace with:
```typescript
constructor(private router: Router, private http: HttpClient) {}
```

### 2c. Replace the fake onLogin() method

Find this block (the fake setTimeout login):
```typescript
onLogin(): void {
  if (!this.isFormValid()) return;
  this.loading = true;
  // TODO: replace with your real auth service call
  setTimeout(() => {
    this.loading = false;
    this.router.navigate(['/home'], { replaceUrl: true });
  }, 1500);
}
```
Replace it with:
```typescript
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
```

---

## 🔧 Step 3 — Connect Signup Page to Real API

> **File to edit:** `frontend/src/app/pages/signup/signup.page.ts`

### 3a. Add HttpClient import at the top

Find:
```typescript
import { Router } from '@angular/router';
```
Replace with:
```typescript
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
```

### 3b. Update the constructor

Find:
```typescript
constructor(private router: Router) {}
```
Replace with:
```typescript
constructor(private router: Router, private http: HttpClient) {}
```

### 3c. Replace the fake onSignUp() method

Find this block:
```typescript
onSignUp(): void {
  if (!this.isFormValid()) return;
  this.loading = true;
  // TODO: replace with your real registration service call
  setTimeout(() => {
    this.loading     = false;
    this.signUpSuccess = true;
  }, 1500);
}
```
Replace it with:
```typescript
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
```

---

## 🔧 Step 4 — Enable HttpClient in app.module.ts

> **File to edit:** `frontend/src/app/app.module.ts`

Find:
```typescript
import { BrowserModule } from '@angular/platform-browser';
```
Add this line directly below it:
```typescript
import { HttpClientModule } from '@angular/common/http';
```

Then find the `imports` array:
```typescript
imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
```
Add `HttpClientModule` to it:
```typescript
imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
```
Or just replace the code with this one:
 import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
---

## 🔧 Step 5 — Add environment API URL (clean approach)

> **File to edit:** `frontend/src/environments/environment.ts`

Find:
```typescript
export const environment = {
  production: false
};
```
Replace with:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

Then in your `.ts` files you can use:
```typescript
import { environment } from '../../../environments/environment';
// and use: environment.apiUrl + '/api/login'
```

---

## ✅ How to Test Everything Works

### Test 1 — Backend health check
Open your browser and go to:
```
http://localhost:3000/api/health
```
You should see:
```json
{ "status": "SheSafe backend is running", "sprint": 1 }
```

### Test 2 — Products database
Open your browser and go to:
```
http://localhost:3000/api/products
```
You should see a JSON list of 8 products.

### Test 3 — Register a user
Use the Signup page in the app — fill in all fields and submit.
Then check MySQL Workbench → shesafe → users table to see the new row.

### Test 4 — Login
Use the Login page — sign in with the account you just created.

---

## ⚠️ Common Problems & Fixes

| Problem | Fix |
|---------|-----|
| `CORS error` in browser console | Make sure backend is running on port 3000 |
| `Cannot POST /api/login` | Make sure you ran `npm install` in the backend folder |
| `ER_ACCESS_DENIED` in backend terminal | Wrong MySQL password in `config/db.js` |
| `Table doesn't exist` error | Run `database.sql` in MySQL Workbench first |
| Login succeeds but goes nowhere | Make sure `/home` route exists in `app-routing.module.ts` |

---

## 📋 API Reference

| Method | Endpoint | Body | Returns |
|--------|----------|------|---------|
| `POST` | `/api/register` | `{ firstName, lastName, email, password }` | `{ message, firstName, email }` |
| `POST` | `/api/login` | `{ email, password }` | `{ message, firstName, email }` |
| `POST` | `/api/logout` | — | `{ message }` |
| `GET`  | `/api/me` | — | `{ logged_in, firstName, email }` |
| `GET`  | `/api/products` | — | Array of products |
| `GET`  | `/api/products?q=kotex` | — | Filtered products |
| `GET`  | `/api/products/:id` | — | Single product object |

---

*Built by [Your Name] — Sprint 1 Backend Task | SheSafe Team 2025*
