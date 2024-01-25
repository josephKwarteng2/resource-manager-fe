import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  AfterViewInit,
  ElementRef,
} from '@angular/core';

import { User, ProjectDetails } from '../../../types/types';
import { UsersService } from '../../../../accounts/admin/services/users.service';
import { ChangeDetectorRef } from '@angular/core';
import { ProjectsService } from '../../../../accounts/admin/services/projects.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'assign-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-modal.component.html',
  styleUrl: './assign-modal.component.css',
})
export class AssignModalComponent implements AfterViewInit {
  @Input() user!: User;
  @Input() users: User[] = [];
  @Input() project!: ProjectDetails;
  opening: boolean = false;
  closed: boolean = false;
  loading: boolean = false;
  bookableUsers: User[] = [];
  searchQuery: string = '';
  query: string = '';
  successMessage: string | null = null;
  errorMessage: string | null = null;
  response: string | null = null;

  @Output() closeAssignEvent = new EventEmitter<void>();
  @Output() submitEvent = new EventEmitter<void>();
  selectedUsersEvent = new EventEmitter<User[]>();
  selectedUsers: any;

  constructor(
    private usersService: UsersService,
    private cdr: ChangeDetectorRef
  ) {}

  closeErrorMessage(): void {
    this.errorMessage = null;
  }

  closeSuccessMessage(): void {
    this.successMessage = null;
  }

  close() {
    this.closed = true;
    this.closeAssignEvent.emit();
  }

  edit() {}

  submit(): void {
    this.usersService
      .assignUser(
        this.project.name,
        this.bookableUsers
          .filter(user => user.selected)
          .map(user => user.userId)
      )
      .subscribe({
        next: (response: any) => {
          if (response.status === 201) {
            this.successMessage =
              response.response && response.response.message;
          } else {
            this.errorMessage =
              response.message || 'An unexpected error occurred.';
          }
          this.response = response;

          setTimeout(() => {
            this.errorMessage = null;
          }, 6000);
        },
        error: (error: any) => {
          if (error.status >= 500) {
            this.errorMessage =
              'Server Error: Something went wrong on the server.';
          } else {
            this.errorMessage =
              error.error && error.error.message
                ? error.error.message
                : 'An unexpected error occurred.';
          }

          setTimeout(() => {
            this.errorMessage = null;
          }, 6000);
        },
        complete: () => {
          this.close();
        },
      });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.opening = false;
    }, 100);
    console.log(this.user);

    this.fetchBookableUsers(this.query);
    // this.fetchProjects();
  }

  ngAfterViewInit(): void {
    console.log('View has been initialized');
    this.fetchBookableUsers(this.query);
  }

  onSearchChange(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    this.fetchBookableUsers(query);
  }

  fetchBookableUsers(query: string): void {
    this.loading = true;
    this.usersService.getBookableUsers(query).subscribe({
      next: (response: any) => {
        const bookableUsers = response.users || response.data;
        if (Array.isArray(bookableUsers)) {
          this.bookableUsers = bookableUsers as User[];
        } else {
          console.log('Invalid bookable users format:', bookableUsers);
        }
      },
      error: error => {
        console.log('Error fetching users:', error);
      },
      complete: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // private fetchProjects(): void {
  //   this.projectsService.fetchProjects().subscribe({
  //     next: (response: any) => {
  //       this.projects = response.projects || [];
  //       console.log('Fetched projects:', this.projects);
  //     },
  //     error: error => {
  //       console.error('Error fetching projects:', error);
  //     },
  //     complete: () => {},
  //   });
  // }

  get modalClasses() {
    return {
      [`modal`]: true,
      [`opening`]: this.opening,
      [`closed`]: this.closed,
    };
  }

  get backdropClasses() {
    return {
      [`backdrop`]: true,
      [`opening`]: this.opening,
      [`closed`]: this.closed,
    };
  }
}
