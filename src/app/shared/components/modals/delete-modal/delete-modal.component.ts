import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../types/types';
import { UsersService } from '../../../../accounts/admin/services/users.service';
@Component({
  selector: 'delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.css',
})
export class DeleteModalComponent {
  @Input() user!: User | undefined;
  @Input() userToDelete!: User | undefined;
  users: User[] = [];
  closed: boolean = false;
  opening: boolean = true;

  showDeleteModal = false;

  constructor(private usersService: UsersService) {}

  @Output() deleteConfirmedEvent = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();

  close() {
    this.closed = true;
    this.cancelEvent.emit();
  }

  submit() {
    this.deleteConfirmedEvent.emit();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.opening = false;
    }, 100);
    console.log(this.user);
  }

  fetchUsers(): void {
    this.usersService.getUsers().subscribe(
      users => {
        this.users = users;
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
  }

  openDeleteModal(user: User): void {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.userToDelete = undefined;
    this.showDeleteModal = false;
  }

  deleteUser(): void {
    if (this.userToDelete) {
      this.usersService.deleteUser(this.userToDelete.email).subscribe(
        () => {
          console.log('User deleted successfully.');
          this.fetchUsers();
          this.closeDeleteModal();
        },
        error => {
          console.error('Error deleting user:', error);
        }
      );
    }
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
