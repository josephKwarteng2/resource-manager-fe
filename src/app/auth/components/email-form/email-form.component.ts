import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ResetActions } from '../../store/reset-password/ResetActions';
import { combineLatest, Subscription } from 'rxjs';
import { ResetState, SendOtpError } from '../../types/reset-types';
import {
  selectIsSubmitting,
  selectError,
} from '../../store/reset-password/ResetReducers';

@Component({
  selector: 'email-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.css', '../../styles/styles.css'],
})
export class EmailFormComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  emailForm!: FormGroup;
  storeData!: Pick<ResetState, 'error' | 'isSubmitting'>;
  storeData$ = combineLatest({
    isSubmitting: this.store.select(selectIsSubmitting),
    error: this.store.select(selectError),
  });

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.emailForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    const storeSubscription = this.storeData$.subscribe({
      next: res => {
        if (res.error) {
          this.storeData.error = res.error;
        }
        this.storeData = res;
      },
      error: (err: SendOtpError) => {
        this.storeData.error = err;
      },
    });

    this.subscriptions.push(storeSubscription);
  }

  getEmailErrors(): string {
    const control = this.emailForm.get('email');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'This field is required';
      } else if (control.hasError('email')) {
        return 'Please enter a valid email address';
      }
    }

    return '';
  }

  submitForm(event: Event) {
    event.preventDefault();
    if (this.emailForm.valid) {
      const email = this.emailForm.value;
      this.store.dispatch(ResetActions.sendOtp(email));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
