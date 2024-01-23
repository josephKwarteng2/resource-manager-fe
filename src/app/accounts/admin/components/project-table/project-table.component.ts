import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ProjectDetails,
  GenericResponse,
} from '../../../../shared/types/types';
import { ProjectCreationModalService } from '../../services/project-creation-modal.service';
import { CommonModule } from '@angular/common';
interface ProjectsApiResponse {
  projects: ProjectDetails[];
}

@Component({
  selector: 'app-project-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-table.component.html',
  styleUrl: './project-table.component.css',
})
export class ProjectTableComponent implements OnInit, OnDestroy {
  totalPages: number = 0;
  projects: ProjectDetails[] = [];
  loading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  private dataSubscription: Subscription | undefined;

  constructor(private projectService: ProjectCreationModalService) {}

  ngOnInit(): void {
    this.fetchProjects();
  }
  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  fetchProjects(): void {
    this.loading = true;
    this.projectService.getProjects().subscribe(
      (response: any) => {
        console.log(response);

        const projects = response.projects || response;
        if (Array.isArray(projects)) {
          this.projects = projects as ProjectDetails[];
        } else {
          console.error('Invalid response format for projects:', projects);
        }
      },
      error => {
        console.error('Error fetching clients:', error);
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
}
