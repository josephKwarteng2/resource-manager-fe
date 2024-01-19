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
import { User } from '../../../types/types';
import { UsersService } from '../../../../accounts/admin/services/users.service';
import { ChangeDetectorRef } from '@angular/core';
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
  opening: boolean = false;
  closed: boolean = false;
  loading: boolean = false;
  bookableUsers: User[] = [];
  searchQuery: string = '';
  query: string = '';
  successMessage: string | null = null;
  errorMessage: string | null = null;

  @Output() closeAssignEvent = new EventEmitter<void>();
  @Output() submitEvent = new EventEmitter<void>();
  @ViewChild('projectNameInput', { static: false })
  projectNameInput!: ElementRef<HTMLInputElement>;

  constructor(
    private usersService: UsersService,
    private cdr: ChangeDetectorRef
  ) {}

  close() {
    this.closed = true;
    this.closeAssignEvent.emit();
  }

  edit() {}

  submit() {
    this.submitEvent.emit();
    this.assignUsersToProject();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.opening = false;
    }, 100);
    console.log(this.user);

    this.fetchBookableUsers(this.query);
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

  private assignUsersToProject(): void {
    if (!this.projectNameInput || !this.projectNameInput.nativeElement) {
      console.error('ProjectNameInput is not yet initialized.');
      return;
    }

    const projectName = this.projectNameInput.nativeElement.value;
    const selectedUserId = this.bookableUsers
      .filter(user => user.selected)
      .map(user => user.userId);

    this.usersService.assignUser(projectName, selectedUserId).subscribe(
      response => {
        this.successMessage = response.message;

        console.log('Users assigned successfully:', response);
      },
      error => {
        this.errorMessage = error.message;
        console.error('Error assigning users:', error);
      }
    );
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
