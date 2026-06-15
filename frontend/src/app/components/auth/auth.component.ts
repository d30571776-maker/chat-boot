import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  template: `
    <div class="auth-container">
      <div class="auth-box">
        <h2>signin or register</h2>
        
        <div *ngIf="!isRegister" class="form-group">
          <input 
            type="email" 
            [(ngModel)]="loginEmail" 
            placeholder="email"
            class="input-field"
          >
          <input 
            type="password" 
            [(ngModel)]="loginPassword" 
            placeholder="password"
            class="input-field"
          >
          <button (click)="loginLocal()" class="btn-primary">
            Login
          </button>
          <button (click)="toggleRegister()" class="btn-secondary">
            New account?
          </button>
        </div>

        <div *ngIf="isRegister" class="form-group">
          <input 
            type="text" 
            [(ngModel)]="regName" 
            placeholder="name"
            class="input-field"
          >
          <input 
            type="email" 
            [(ngModel)]="regEmail" 
            placeholder="email"
            class="input-field"
          >
          <input 
            type="password" 
            [(ngModel)]="regPassword" 
            placeholder="password"
            class="input-field"
          >
          <button (click)="registerLocal()" class="btn-primary">
            Register
          </button>
          <button (click)="toggleRegister()" class="btn-secondary">
            Back to login?
          </button>
        </div>

        <div class="separator">or use</div>

        <div class="oauth-buttons">
          <button (click)="authService.loginGoogle()" class="btn-google">
            🔍 Google
          </button>
          <button (click)="authService.loginMicrosoft()" class="btn-microsoft">
            💻 Microsoft
          </button>
        </div>

        <div *ngIf="errorMsg" class="error-msg">{{ errorMsg }}</div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }

    .auth-box {
      background: rgba(255, 255, 255, 0.95);
      border: 5px solid #ffff00;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 0 50px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 255, 0, 0.5);
      max-width: 400px;
      width: 100%;
    }

    .auth-box h2 {
      text-align: center;
      font-size: 28px;
      margin: 0 0 30px 0;
      color: #333;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-bottom: 20px;
    }

    .input-field {
      padding: 12px;
      border: 2px solid #ff0000;
      border-radius: 5px;
      font-size: 14px;
      font-family: Arial, sans-serif;
      background: #f0f0f0;
      transition: 0.3s;
    }

    .input-field:focus {
      outline: none;
      border-color: #ffff00;
      box-shadow: 0 0 10px rgba(255, 255, 0, 0.5);
      background: #fff;
    }

    .btn-primary {
      background: #00ff00;
      border: 3px solid #000;
      padding: 12px;
      font-weight: bold;
      font-size: 16px;
      cursor: pointer;
      border-radius: 5px;
      text-transform: uppercase;
      transition: 0.2s;
    }

    .btn-primary:hover {
      background: #00cc00;
      transform: scale(1.05);
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
    }

    .btn-secondary {
      background: #ff6600;
      border: 2px solid #ff0000;
      padding: 10px;
      font-weight: bold;
      cursor: pointer;
      border-radius: 5px;
      color: white;
      font-size: 14px;
      text-transform: uppercase;
      transition: 0.2s;
    }

    .btn-secondary:hover {
      background: #ff3300;
      transform: scale(1.05);
    }

    .separator {
      text-align: center;
      margin: 25px 0;
      font-weight: bold;
      font-size: 12px;
      text-transform: uppercase;
      color: #333;
    }

    .oauth-buttons {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
    }

    .btn-google, .btn-microsoft {
      flex: 1;
      padding: 12px;
      border: 2px solid #000;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
      font-size: 14px;
      text-transform: uppercase;
      transition: 0.2s;
    }

    .btn-google {
      background: #fff;
      color: #333;
    }

    .btn-google:hover {
      background: #f0f0f0;
      transform: scale(1.05);
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    }

    .btn-microsoft {
      background: #00a4ef;
      color: white;
    }

    .btn-microsoft:hover {
      background: #0078d4;
      transform: scale(1.05);
      box-shadow: 0 0 20px rgba(0, 120, 212, 0.5);
    }

    .error-msg {
      background: #ff6666;
      color: white;
      padding: 12px;
      border-radius: 5px;
      text-align: center;
      font-weight: bold;
      margin-top: 15px;
    }
  `]
})
export class AuthComponent implements OnInit {
  isRegister = false;
  loginEmail = '';
  loginPassword = '';
  regName = '';
  regEmail = '';
  regPassword = '';
  errorMsg = '';

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.authService.handleCallback(params['token']);
      }
    });
  }

  toggleRegister() {
    this.isRegister = !this.isRegister;
    this.errorMsg = '';
  }

  loginLocal() {
    if (!this.loginEmail || !this.loginPassword) {
      this.errorMsg = 'enter email and password';
      return;
    }
    this.authService.login(this.loginEmail, this.loginPassword).subscribe(
      () => this.router.navigate(['/chat']),
      err => this.errorMsg = 'login failed'
    );
  }

  registerLocal() {
    if (!this.regEmail || !this.regPassword || !this.regName) {
      this.errorMsg = 'fill all fields';
      return;
    }
    this.authService.register(this.regEmail, this.regPassword, this.regName).subscribe(
      () => this.router.navigate(['/chat']),
      err => this.errorMsg = 'register failed'
    );
  }
}
