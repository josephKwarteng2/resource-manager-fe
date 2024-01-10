import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ViewChildren,
  QueryList,
} from '@angular/core';
import {
  InputFields,
  ResetToggleService,
} from '../../services/reset-toggle.service';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { SendOtpResponse } from '../../types/reset-types';
import { selectResponse } from '../../store/reset-password/ResetReducers';
import { Subscription } from 'rxjs';

@Component({
  selector: 'otp-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './otp-form.component.html',
  styleUrls: ['./otp-form.component.css', '../../styles/styles.css'],
})
export class OtpFormComponent implements OnInit, OnDestroy, AfterViewInit {
  subscriptions: Subscription[] = [];
  otpForm!: FormGroup;
  nextFormField!: InputFields;
  resBody!: SendOtpResponse;
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  @Input() numberOfBoxes = 6;
  @Output() otpChange = new EventEmitter<string>();
  @ViewChild('otpInput') otpInput!: ElementRef;
  otpValues: string[] = [];

  constructor(
    private resetToggleService: ResetToggleService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.otpForm = new FormGroup({
      otp: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

    const storeSubscription = this.store.select(selectResponse).subscribe({
      next: res => {
        console.log(res);
        this.resBody = res as SendOtpResponse;
      },
      error: err => {
        console.log(err);
      },
    });

    this.subscriptions.push(storeSubscription);
  }

  ngAfterViewInit() {
    this.setFocus(0);
  }

  private setFocus(index: number) {
    const inputIndex = Math.min(index, this.numberOfBoxes - 1);
    const input = this.otpInputs.toArray()[inputIndex].nativeElement;
    input.focus();
  }

  private emitOtp() {
    const concatenatedValue = this.otpValues.join('');
    this.otpChange.emit(concatenatedValue);
  }

  onOtpInputChange(event: any, index: number) {
    if (event.inputType === 'delete' && this.otpValues.length > 0) {
      this.otpValues.pop();
    } else if (
      event.target.value.length === 1 &&
      index < this.numberOfBoxes - 1
    ) {
      this.otpValues[index] = event.target.value;
      this.setFocus(index + 1);
    } else if (
      event.target.value.length === 1 &&
      index === this.numberOfBoxes - 1
    ) {
      this.otpValues[index] = event.target.value;
      this.emitOtp();
    }
  }
  onOtpInputKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && index > 0) {
      this.setFocus(index - 1);
    }
  }

  getOtpErrors(): string {
    const control = this.otpForm.get('otp');
    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.hasError('required')) {
        return 'This field is required';
      }
    }

    return '';
  }

  submitForm(event: Event) {
    event.preventDefault();
    const otp = parseInt(this.otpValues.join(''), 10);

    //Compare otp and switch field if it matches
    if (otp === this.resBody.OTP) {
      this.nextFormField = 'changePassword';
      this.resetToggleService.toggle(this.nextFormField);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
