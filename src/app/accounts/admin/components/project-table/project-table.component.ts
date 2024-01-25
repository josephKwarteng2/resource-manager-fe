import {
  Component,
  OnInit,
  OnDestroy,
  ViewContainerRef,
  ComponentRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DropdownService } from '../../../../shared/components/dropdown/dropdown.service';
import { User } from '../../../../shared/interfaces/types';
import { DropdownComponent } from '../../../../shared/components/dropdown/dropdown.component';
import {
  ProjectDetails,
  GenericResponse,
} from '../../../../shared/interfaces/types';
import { AssignModalService } from '../../../../shared/components/modals/assign-modal/assign.service';
import { AssignModalComponent } from '../../../../shared/components/modals/assign-modal/assign-modal.component';
import { ProjectCreationModalService } from '../../services/project-creation-modal.service';
import { CommonModule } from '@angular/common';
import { ProjectDetailsModalComponent } from '../../../../shared/components/modals/project-details-modal/project-details-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
@Component({
  selector: 'app-project-table',
  standalone: true,
  imports: [CommonModule, AssignModalComponent, ProjectDetailsModalComponent, PaginationComponent],
  templateUrl: './project-table.component.html',
  styleUrl: './project-table.component.css',
})
export class ProjectTableComponent implements OnInit, OnDestroy {
  totalPages: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  projects: ProjectDetails[] = [];
  loading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  totalProjects: number = 0;
  isMenuOpen: boolean = false;



  private dataSubscription: Subscription | undefined;
  private dropdownRef?: ComponentRef<DropdownComponent>;
  private assignModalRef?: ComponentRef<AssignModalComponent>;

  constructor(private projectService: ProjectCreationModalService, private modalService: NgbModal,  private viewContainerRef: ViewContainerRef,private assignModalService: AssignModalService) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  openAssignModal(project: ProjectDetails): void {
    const modalComponentRef = this.assignModalService.open(
      this.viewContainerRef
    );
    modalComponentRef.instance.project = project;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchProjects();
  }

  fetchProjects(): void {
    this.loading = true;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;

    const endIndex = startIndex + this.itemsPerPage;

    this.projectService.getProjects().subscribe(
      (response: any) => {
       
        
        const projects = response.projects || response;
        if (Array.isArray(projects)) {
          this.projects = projects.slice(startIndex, endIndex) as ProjectDetails[];
          this.totalProjects = projects.length;
          this.totalPages = Math.ceil(projects.length / this.itemsPerPage);
        } else {
          console.error('Invalid response format for projects:', projects);
        }
      },
      error => {
        console.error('Error fetching Projects:', error);
      },
      () => {
        this.loading = false;
      }
    );
  }

  deleteProject(projectCode: string): void {
    this.projectService.deleteProject(projectCode).subscribe({
      next: () => {
        this.successMessage = 'Project deleted successfully.';
        this.errorMessage = null;
        this.fetchProjects();
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: error => {
        this.errorMessage = 'Error deleting project.';
        this.successMessage = null;
        console.error('Error deleting project:', error);
        setTimeout(() => {
          this.errorMessage = null;
        }, 3000);
      },
    });
  }
  openProjectDetailsModal(project: ProjectDetails): void {
    const modalRef = this.modalService.open(ProjectDetailsModalComponent);
    modalRef.componentInstance.project = project;
  }


}
