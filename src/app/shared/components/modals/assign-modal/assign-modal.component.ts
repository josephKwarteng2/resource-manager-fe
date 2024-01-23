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
import { Projects, User } from '../../../types/types';
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
  opening: boolean = false;
  closed: boolean = false;
  loading: boolean = false;
  bookableUsers: User[] = [];
  searchQuery: string = '';
  query: string = '';
  successMessage: string | null = null;
  errorMessage: string | null = null;
  selectedProject: string = '';
  projects: Projects[] = [];

  @Output() closeAssignEvent = new EventEmitter<void>();
  @Output() submitEvent = new EventEmitter<void>();
  @ViewChild('projectNameInput', { static: false })
  @Output()
  selectedUsersEvent = new EventEmitter<User[]>();
  projectNameInput!: ElementRef<HTMLInputElement>;
  selectedUsers: any;

  constructor(
    private usersService: UsersService,
    private cdr: ChangeDetectorRef,
    private projectsService: ProjectsService
  ) {}

  close() {
    this.closed = true;
    this.closeAssignEvent.emit();
  }

  edit() {}

  submit(): void {
    this.submitEvent.emit();
    this.assignUsersToProject();
    this.close();
    this.selectedUsersEvent.emit(
      this.bookableUsers.filter(user => user.selected)
    );
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.opening = false;
    }, 100);
    console.log(this.user);

    // this.fetchBookableUsers(this.query);
    this.fetchProjects();
  }

  ngAfterViewInit(): void {
    console.log('View has been initialized');
    // this.fetchBookableUsers(this.query);
  }

  onSearchChange(event: Event): void {
    const query = (event.target as HTMLInputElement).value;
    // this.fetchBookableUsers(query);
  }

  // fetchBookableUsers(query: string): void {
  //   this.loading = true;
  //   this.usersService.getBookableUsers(query).subscribe({
  //     next: (response: any) => {
  //       const bookableUsers = response.users || response.data;
  //       if (Array.isArray(bookableUsers)) {
  //         this.bookableUsers = bookableUsers as User[];
  //       } else {
  //         console.log('Invalid bookable users format:', bookableUsers);
  //       }
  //     },
  //     error: error => {
  //       console.log('Error fetching users:', error);
  //     },
  //     complete: () => {
  //       this.loading = false;
  //       this.cdr.detectChanges();
  //     },
  //   });
  // }

  private fetchProjects(): void {
    this.projectsService.fetchProjects().subscribe({
      next: (response: any) => {
        this.projects = response.projects || [];
        console.log('Fetched projects:', this.projects);
      },
      error: error => {
        console.error('Error fetching projects:', error);
      },
      complete: () => {},
    });
  }

  private assignUsersToProject(): void {
    if (!this.projectNameInput || !this.projectNameInput.nativeElement) {
      console.error('ProjectNameInput is not yet initialized.');
      return;
    }

    const projectName = this.projectNameInput.nativeElement.value;
    const selectedUserId = this.bookableUsers
      .filter(user => user.selected)
      .map(user => user.userId);

    this.usersService.assignUser(projectName, selectedUserId).subscribe({
      next: (response: any) => {
        this.successMessage = response.message;
        console.log('Users assigned successfully:', response);
      },
      error: (error: any) => {
        this.errorMessage = error.message;
        console.error('Error assigning users:', error);
      },
      complete: () => {
        this.selectedUsersEvent.emit(
          this.bookableUsers.filter(user => user.selected)
        );
      },
    });
  }

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
