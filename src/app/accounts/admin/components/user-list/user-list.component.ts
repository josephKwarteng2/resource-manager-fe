import { Component, OnInit, OnDestroy } from '@angular/core';
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
@Component({
  selector: 'user-list',
  standalone: true,
  imports: [
    CommonModule,
    CdkMenuModule,
    ViewModalComponent,
    DeleteModalComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];

  dropdownModal = modal;
  loading: boolean = false;

  private dataSubscription: Subscription | undefined;

  constructor(
    private usersService: UsersService,
    private userCreationService: CreateUserService,
    private overlay: Overlay
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

  openModal() {
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

    const modalPortal = new ComponentPortal(ViewModalComponent);
    const deleteModalPortal = new ComponentPortal(DeleteModalComponent);
    overlayRef.attach(modalPortal);
    overlayRef.attach(deleteModalPortal);
  }
  activeView = 'general';

  toggleView(view: string) {
    this.activeView = view;
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  fetchUsers(): void {
    this.loading = true;

    this.usersService.getUsers().subscribe(
      (response: any) => {
        const users = response.users || response.data;
        if (Array.isArray(users)) {
          this.users = users as User[];
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
