import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { BASE_URL } from '../../../../environment/config';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ProjectDetails, GenericResponse } from '../../../shared/types/types';
import { ProjectCreationModalComponent } from '../../../shared/components/modals/project-creation-modal/project-creation-modal.component';
import { ErrorHandlingService } from './error-handling.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectCreationModalService {
  constructor(
    private http: HttpClient,
    private projectCreationModalService: NgbModal,
    private errorHandlingService: ErrorHandlingService // Inject the error handling service
  ) { }

  addNewProject(data: ProjectDetails): Observable<ProjectDetails> {
    return this.http.post<ProjectDetails>(`${BASE_URL}/project/store`, data).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      this.errorHandlingService.handleError('Client-side error: ' + error.error.message);
    } else {
      this.errorHandlingService.handleError(`Server returned code ${error.status}, body was: ${error.error}`);
    }

    return throwError(error);
  }

  getProjects(): Observable<ProjectDetails[]> {
    return this.http.get<ProjectDetails[]>(`${BASE_URL}/project/fetch`, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'skip-browser-warning',
      },
    })
      .pipe(
        catchError(error => {
          this.errorHandlingService.handleError('Error in getClients: ' + error);
          throw error;
        })
      );
  }

  deleteProject(projectCode: string): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(
      `${BASE_URL}/projects/delete`,
      {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'skip-browser-warning',
        },
        params: {
          projectCode: projectCode,
        },
      }
    );
  }

  openProjectCreationModal(): NgbModalRef {
    const modalRef = this.projectCreationModalService.open(ProjectCreationModalComponent, {
      centered: true,
      backdrop: 'static',
    });

    modalRef.result.finally(() => {
      // You can handle any final tasks here
    });

    return modalRef;
  }
}