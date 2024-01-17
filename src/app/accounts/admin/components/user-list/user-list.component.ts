import {
  Component,
  OnInit,
  OnDestroy,
  ViewContainerRef,
  ComponentRef,
} from '@angular/core';
import { GenericResponse, User } from '../../../../shared/types/types';
import { Subscription } from 'rxjs';
import { CreateUserService } from '../../services/create-user.service';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import { ViewModalComponent } from '../view-modal/view-modal.component';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ViewModalService } from '../view-modal/view-modal.service';
import { DeleteModalService } from '../delete-modal/delete-modal.service';
import { AssignModalComponent } from '../assign-modal/assign-modal.component';
import { AssignModalService } from '../assign-modal/assign.service';

@Component({
  selector: 'user-list',
  standalone: true,
  imports: [
    CommonModule,
    ViewModalComponent,
    PaginationComponent,
    DeleteModalComponent,
    AssignModalComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  loading: boolean = false;
  showDropdownForUser: User | null = null;

  private dataSubscription: Subscription | undefined;
  private viewModalRef?: ComponentRef<ViewModalComponent>;
  private assignModalRef?: ComponentRef<AssignModalComponent>;

  constructor(
    private usersService: UsersService,
    private deleteModalService: DeleteModalService,
    private viewModalService: ViewModalService,
    private viewContainerRef: ViewContainerRef,
    private assignModalService: AssignModalService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  openDeleteModal(user: User): void {
    const modalRef = this.deleteModalService.open(this.viewContainerRef, {
      user,
    });

    modalRef.instance.deleteConfirmedEvent.subscribe({
      next: (response: GenericResponse) => {
        console.log('Deletion successful:', response);
      },
      error: (error: any) => {
        console.error('Error deleting user:', error);
      },
    });
  }

  openViewModal(user?: User) {
    /**
     * user parameter should not be optional.
     */
    this.viewModalRef = this.viewModalService.open(this.viewContainerRef, {
      user,
    });
  }
  openAssignModal(user?: User) {
    this.assignModalRef = this.assignModalService.open(this.viewContainerRef, {
      user,
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchUsers();
  }

  toggleDropdown(user: User): void {
    // Toggle the dropdown for the specified user
    this.showDropdownForUser = this.showDropdownForUser === user ? null : user;
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  fetchUsers(): void {
    this.loading = true;

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;

    const endIndex = startIndex + this.itemsPerPage;

    this.usersService.getUsers().subscribe({
      next: (response: any) => {
        const users = response.users || response.data;
        if (Array.isArray(users)) {
          this.users = users.slice(startIndex, endIndex) as User[];
          this.totalPages = Math.ceil(users.length / this.itemsPerPage);
        } else {
          console.error('Invalid response format for users:', users);
        }
      },
      error: error => {
        console.error('Error fetching users:', error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
