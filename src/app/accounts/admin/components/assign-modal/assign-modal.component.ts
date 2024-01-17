import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../../../shared/types/types';
import { UsersService } from '../../services/users.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'assign-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assign-modal.component.html',
  styleUrl: './assign-modal.component.css',
})
export class AssignModalComponent {
  @Input() user!: User;
  opening: boolean = false;
  closed: boolean = false;
  loading: boolean = false;
  bookableUsers: User[] = [];

  @Output() closeAssignEvent = new EventEmitter<void>();
  @Output() submitEvent = new EventEmitter<void>();

  constructor(
    private usersService: UsersService,
    private cdr: ChangeDetectorRef
  ) {}

  close() {
    this.closed = true;
    this.closeAssignEvent.emit();
  }

  edit() {
    /**
     * do something to edit the user
     */
  }

  submit() {
    /**
     * Access the user to make an api call before the last line
     */
    this.submitEvent.emit();
  }

  /**
   * Just animations for modal fading in and out
   */
  ngOnInit(): void {
    setTimeout(() => {
      this.opening = false;
    }, 100);
    console.log(this.user);

    this.fetchBookableUsers();
  }

  fetchBookableUsers(): void {
    this.loading = true;
    this.usersService.getBookableUsers().subscribe({
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
