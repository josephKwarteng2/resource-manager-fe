import {
  Component,
  OnInit,
  OnDestroy,
  ViewContainerRef,
  ComponentRef,
} from '@angular/core';
import { User } from '../../../../shared/types/types';
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
@Component({
  selector: 'user-list',
  standalone: true,
  imports: [
    CommonModule,
    ViewModalComponent,
    PaginationComponent,
    DeleteModalComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;
  loading: boolean = false;
  showDropdownForUser: User | null = null;
  totalUsers: number = 0;

  private dataSubscription: Subscription | undefined;
  private viewModalRef?: ComponentRef<ViewModalComponent>;
  private deleteModalRef?: ComponentRef<DeleteModalComponent>;

  constructor(
    private usersService: UsersService,
    private userCreationService: CreateUserService,
    private overlay: Overlay,
    private viewModalService: ViewModalService,
    private viewContainerRef: ViewContainerRef,
    private deleteModalService: DeleteModalService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  openDeleteModal(user?: User) {
    this.deleteModalRef = this.deleteModalService.open(this.viewContainerRef);
  }
  openViewModal(user?: User) {
    /**
     * user parameter should not be optional.
     */
    this.viewModalRef = this.viewModalService.open(this.viewContainerRef, {
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
