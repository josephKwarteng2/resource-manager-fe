import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormBuilder,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { SpecializationService } from '../../services/specialization.service';
import { SpecializationModalComponent } from '../../components/specialization-modal/specialization-modal.component';
import { DepartmentModalComponent } from '../../components/department-modal/department-modal.component';
import { DepartmentService } from '../../services/department.service';
import { HttpClientModule } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-usercreation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usercreation.component.html',
  styleUrl: './usercreation.component.css',
})
export class UsercreationComponent {
  formData: FormGroup;
  loading = false;
  success = false;
  error = false;
  errorMessages: { roles?: string; email?: string } = {};
  selectedDepartment: string = '';
  selectedSpecialization: string = '';
  selectedRoles: string = '';

  specializationDropdownOpen = false;
  rolesDropdownOpen = false;
  departmentDropdownOpen = false;
  specializations: string[] = [];
  department: string[] = [];
  roles: string[] = [];

  constructor(
    private router: Router,
    private adminService: AdminService,
    private specializationService: SpecializationService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private departmentService: DepartmentService
  ) {
    this.formData = this.fb.group({
      roles: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      specialization: [''],
      department: [''],
      role: [''],
    });

    this.specializationService.specializations$.subscribe(
      (specializations: string[]) => {
        this.specializations = specializations;
      }
    );

    this.departmentService.departments$.subscribe((departments: string[]) => {
      this.department = departments;
    });
  }

  SpecializationDropdown() {
    this.specializationDropdownOpen = false;
  }
  DepartmentDropdown() {
    this.departmentDropdownOpen = false;
  }
  RolesDropdown() {
    this.rolesDropdownOpen = false;
  }

  selectDepartment(department: string) {
    const departmentControl = this.formData.get('department');
    if (departmentControl) {
      departmentControl.setValue(department);
      this.selectedDepartment = department;
      this.DepartmentDropdown();
    }
  }
  selectRole(role: string) {
    const rolesControl = this.formData.get('roles');
    if (rolesControl) {
      rolesControl.setValue(role);
      this.selectedRoles = role;
      this.RolesDropdown();
    }
  }

  toggleSpecializationDropdown() {
    this.specializationDropdownOpen = !this.specializationDropdownOpen;
  }
  toggleDepartmentDropdown() {
    this.departmentDropdownOpen = !this.departmentDropdownOpen;
  }
  toggleRolesDropdown() {
    this.rolesDropdownOpen = !this.rolesDropdownOpen;
  }

  selectOption(option: string) {
    console.log('Selected Option:', option);
    this.SpecializationDropdown();
    this.DepartmentDropdown();
    this.RolesDropdown();
  }

  selectSpecialization(specialization: string) {
    const specializationControl = this.formData.get('specialization');
    if (specializationControl) {
      specializationControl.setValue(specialization);
      this.selectedSpecialization = specialization;
      this.SpecializationDropdown();
    }
  }

  onSpecializationChange(event: any) {
    const selectedValue = event.target.value;
    if (selectedValue === 'add_new_specialization') {
      this.openSpecializationModal();
    }
  }

  openSpecializationModal() {
    const modalRef = this.modalService.open(SpecializationModalComponent, {
      centered: true,
    });

    modalRef.componentInstance.saveSpecialization.subscribe(
      (newSpecialization: string) => {
        console.log('Received new specialization:', newSpecialization);
        this.updateSpecializationDropdown(newSpecialization);
        this.fetchSpecializations();
      }
    );
  }

  updateSpecializationDropdown(newSpecialization: string) {
    const specializationControl = this.formData.get('specialization');

    if (specializationControl) {
      const updatedSpecializations = [
        ...this.specializations,
        newSpecialization,
      ];
      this.specializationService.setSpecializations(updatedSpecializations);
      specializationControl.setValue(newSpecialization);
    } else {
      console.error('Specialization control is null');
    }
  }
  private fetchSpecializations() {
    this.specializationService.getSpecializations().subscribe(
      (specializations: string[]) => {
        console.log(
          'Fetched specializations from the backend:',
          specializations
        );
        // Handle the fetched departments as needed
      },
      err => {
        console.error('Error fetching specializations from the backend:', err);
      }
    );
  }

  onDepartmentChange(event: any) {
    const selectedValue = event.target.value;
    if (selectedValue === 'add_new_department') {
      this.openDepartmentModal();
    }
  }

  openDepartmentModal() {
    const modalRef = this.modalService.open(DepartmentModalComponent, {
      centered: true,
    });

    modalRef.componentInstance.saveDepartment.subscribe(
      (newDepartment: string) => {
        console.log('Received new department:', newDepartment);
        this.updateDepartmentDropdown(newDepartment);
        this.fetchDepartments();
      }
    );
  }

  updateDepartmentDropdown(newDepartment: string) {
    const departmentControl = this.formData.get('department');
    if (departmentControl) {
      const updatedDepartments = [...this.department, newDepartment];
      this.departmentService.setDepartments(updatedDepartments);
      departmentControl.setValue(newDepartment);
    } else {
      console.error('Department control is null');
    }
  }

  fetchDepartments() {
    // Call the service to fetch the list of departments
    this.departmentService.getDepartments().subscribe(
      (departments: string[]) => {
        console.log('Fetched departments from the backend:', departments);
        // Handle the fetched departments as needed
      },
      err => {
        console.error('Error fetching departments from the backend:', err);
      }
    );
  }

  onUserCreate() {
    this.loading = false;
    this.success = false;
    this.error = false;
    this.errorMessages = {};

    if (this.formData.valid) {
      this.loading = true;

      this.adminService
        .addNew(this.formData.value)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(
          response => {
            console.log('Post request successful', response);

            this.success = true;
          },
          error => {
            console.error('Error in post request', error);

            this.error = true;

            if (error.error && typeof error.error === 'object') {
              this.errorMessages = error.error;
            }
          }
        );
    } else {
      console.error('Form is not valid');
    }
  }

  exitPage() {
    this.router.navigate(['/admin/dashboard']);
  }
}
