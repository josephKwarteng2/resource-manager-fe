import { Component, EventEmitter, Output, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SpecializationService } from '../../services/specialization.service';
//import { SpecializationResponse } from '../reponse.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-specialization-modal',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './specialization-modal.component.html',
  styleUrls: ['./specialization-modal.component.css'],
})
export class SpecializationModalComponent {
  @Output() saveSpecialization = new EventEmitter<string>();
  @Input() formGroup!: FormGroup;
  modalForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private specializationService: SpecializationService
  ) {
    this.modalForm = this.fb.group({
      newSpecialization: ['', Validators.required],
      // Add any additional form controls as needed
    });
  }

  onSave() {
    if (this.modalForm.valid) {
      const newSpecialization = this.modalForm.value.newSpecialization;

      // Call the service to add the new specialization
      this.specializationService.addSpecialization(newSpecialization).subscribe(
        (response: ResponseType) => {
          console.log(
            'New specialization added to the backend:',
            newSpecialization
          );
          // Emit the new specialization to the parent component
          this.saveSpecialization.emit(newSpecialization);
          this.closeModal();
        },
        err => {
          console.error('Error adding specialization to the backend:', err);
        }
      );
    }
  }
  fetchSpecializations() {
    // Call the service to fetch the list of specializations
    this.specializationService.getSpecializations().subscribe(
      (specializations: string[]) => {
        console.log(
          'Fetched specializations from the backend:',
          specializations
        );
        // Handle the fetched specializations as needed
      },
      err => {
        console.error('Error fetching specializations from the backend:', err);
      }
    );
  }

  closeModal() {
    this.activeModal.close();
  }
}
