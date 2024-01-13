import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'work-specialization',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './work-specialization.component.html',
  styleUrl: './work-specialization.component.css',
})
export class WorkSpecializationComponent {}
