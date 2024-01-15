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
import { modal } from './modal';
import { CdkMenuModule } from '@angular/cdk/menu';
import { ViewModalComponent } from '../view-modal/view-modal.component';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ViewModalService } from '../view-modal/view-modal.service';
@Component({
  selector: 'user-list',
  standalone: true,
  imports: [
    CommonModule,
    CdkMenuModule,
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
  dropdownModal = modal;
  loading: boolean = false;
  showDropdownForUser: User | null = null;

  private dataSubscription: Subscription | undefined;
  private viewModalRef?: ComponentRef<ViewModalComponent>;

  constructor(
    private usersService: UsersService,
    private userCreationService: CreateUserService,
    private overlay: Overlay,
    private viewModalService: ViewModalService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  openDeleteModal(): void {
    const overlayConfig = new OverlayConfig({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
    });

    const overlayRef = this.overlay.create(overlayConfig);

    const deleteModalPortal = new ComponentPortal(DeleteModalComponent);
    const deleteModalRef = overlayRef.attach(deleteModalPortal);
  }

  openViewModal(user?: User) {
    /**
     * user parameter should not be optional.
     */
    this.viewModalRef = this.viewModalService.open(this.viewContainerRef, {
      user,
    });
  }
  // openModal() {
  //   const overlayConfig = new OverlayConfig({
  //     hasBackdrop: true,
  //     backdropClass: 'cdk-overlay-dark-backdrop',
  //     positionStrategy: this.overlay
  //       .position()
  //       .global()
  //       .centerHorizontally()
  //       .centerVertically(),
  //   });

  //   const overlayRef = this.overlay.create(overlayConfig);

  //   const modalPortal = new ComponentPortal(ViewModalComponent);
  //   const deleteModalPortal = new ComponentPortal(DeleteModalComponent);
  //   overlayRef.attach(modalPortal);
  //   overlayRef.attach(deleteModalPortal);
  // }
  // activeView = 'general';

  // toggleView(view: string) {
  //   this.activeView = view;
  // }

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

    this.usersService.getUsers().subscribe(
      (response: any) => {
        const users = response.users || response.data;
        if (Array.isArray(users)) {
          this.users = users.slice(startIndex, endIndex) as User[];
          this.totalPages = Math.ceil(users.length / this.itemsPerPage);
        } else {
          console.error('Invalid response format for users:', users);
        }
      },
      error => {
        console.error('Error fetching users:', error);
      },
      () => {
        this.loading = false;
      }
    );
  }
}
