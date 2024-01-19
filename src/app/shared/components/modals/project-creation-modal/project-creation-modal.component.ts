import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import {
  FormGroup,

  ReactiveFormsModule,
  FormBuilder,


} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal, } from '@ng-bootstrap/ng-bootstrap';
import { finalize, debounceTime, distinctUntilChanged  } from 'rxjs/operators';
import { ProjectCreationModalService } from '../../../../accounts/admin/services/project-creation-modal.service';
import { ClientCreationModalService } from '../../../../accounts/admin/services/client-creation-modal.service';
import { ClientDetails } from '../../../types/types';
// import { CalenderComponent } from '../calender/calender.component';

@Component({
  selector: 'app-project-creation-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-creation-modal.component.html',
  styleUrl: './project-creation-modal.component.css'
})
export class ProjectCreationModalComponent implements OnInit{
  @Input() isOpen = true;
  showClientDropdown = false;
  formData: FormGroup;
  loading = false;
  success = false;
  error = false;
  errorMessages: { roles?: string; email?: string } = {};
  clients: ClientDetails[] = [];
  filteredClients: ClientDetails[] = [];
  date: Date | undefined;

  constructor(
    private router: Router,
    private projectcreationService: ProjectCreationModalService,
    private clientService: ClientCreationModalService,
    private fb: FormBuilder,
    private modalService: NgbModal,

  ){
    this.formData = this.fb.group({
      details: [''],
      name: [''],
      client: [''],
      date: [''],
      clientSearch: [''],
    });
  }

  OnCreateProject(){
    this.loading = false;
    this.success = false;
    this.error = false;
    this.errorMessages = {};
    if (this.formData.valid) {
      // this.loading = true;

      this.projectcreationService
        .addNewProject(this.formData.value)
        .pipe(
          finalize(() => {
            // this.loading = false;
          })
        )
        .subscribe(
          response => {
            console.log('Post request successful', response);

            // this.success = true;
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
  closeUsercreationModal() {
    this.isOpen = false;

  }
  ngOnInit(): void {
    this.fetchClients();
    
    this.formData.get('clientSearch')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(value => this.filterClients());

  }
  fetchClients(): void {
    this.clientService.getClients()
      .subscribe(
        (response: { clients: ClientDetails[] }) => {
          if (Array.isArray(response.clients)) {
            this.clients = response.clients;
          } else {
            console.error('Invalid clients array in API response:', response);
          }
        },
        error => {
          console.error('Error fetching clients:', error);
        }
      );
  }
  
    
  
  filterClients(): void {
    const searchTerm = this.formData.get('clientSearch')!.value;
    // Implement client filtering logic based on the searchTerm
    this.filteredClients = this.clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  selectClient(client: ClientDetails): void {
    // this.formData.patchValue({ clientSearch: client.name });
    if(this.formData.get('clientSearch')){
    this.formData.get('clientSearch')!.setValue(client.name);
    this.showClientDropdown = false;
 
  }
  }

}
