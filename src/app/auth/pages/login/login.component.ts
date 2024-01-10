import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginSideIllustrationComponent } from '../../components/login-side-illustration/login-side-illustration.component';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../store/authorization/AuthActions';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  LoginState,
  selectLogin,
} from '../../store/authorization/AuthReducers';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    LoginSideIllustrationComponent,
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../styles/styles.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  subcriptions: Subscription[] = [];
  loginForm!: FormGroup;
  showPassword: boolean = false;
  storeData!: LoginState;
  successMessage: string | null = null;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });

    const storeSubscription = this.store.select(selectLogin).subscribe({
      next: res => {
        this.storeData = res;
        // Check if login is successful and set successMessage
        if (this.storeData.message === 'Login successful') {
          this.successMessage = this.storeData.message;

          // Assuming you want to clear the message after displaying it once
          setTimeout(() => {
            this.successMessage = null;
          }, 5000); // Clear message after 5 seconds (adjust as needed)
        }
      },
    });

    this.subcriptions.push(storeSubscription);
  }

  getEmailErrors(): string {
    const control = this.loginForm.get('email');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'This field is required';
      } else if (control.hasError('email')) {
        return 'Please enter a valid email address';
      }
    }

    return '';
  }

  getPasswordErrors() {
    const control = this.loginForm.get('password');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return "Password can't be empty";
      }
    }

    return '';
  }

  get passwordField() {
    return this.showPassword ? 'text' : 'password';
  }

  submitForm(event: Event) {
    event.preventDefault();
    const userDetails = this.loginForm.value;
    if (this.loginForm.valid) {
      this.store.dispatch(AuthActions.login(userDetails));
    }
  }

  ngOnDestroy(): void {
    this.subcriptions.forEach(sub => sub.unsubscribe());
  }
}
