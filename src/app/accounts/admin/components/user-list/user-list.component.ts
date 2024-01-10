import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../../shared/types/types';
import { Subscription } from 'rxjs';
import { CreateUserService } from '../../services/create-user.service';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import { modal } from './modal';
import { CdkMenuModule } from '@angular/cdk/menu';
import { EditModalComponent } from '../edit-modal/edit-modal.component';

@Component({
  selector: 'user-list',
  standalone: true,
  imports: [CommonModule, CdkMenuModule, EditModalComponent],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  newUser: User = {
    profilePicture: '',
    firstName: '',
    lastName: '',
    email: '',
    userId: '',
    phoneNumber: '',
    changePassword: false,
    department: 'Service Center',
    roles: 'Basic User',
    specializations: [],
  };

  dropdownModal = modal;
  loading: boolean = false;
  selectedUser: User | null = null;
  showEditModal = false;

  private dataSubscription: Subscription | undefined;

  constructor(
    private usersService: UsersService,
    private userCreationService: CreateUserService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  openEditModal(user: User): void {
    this.selectedUser = user;

    console.log('Selected User:', this.selectedUser);
  }

  handleDropdownOption(option: {
    edit?: string;
    view?: string;
    delete?: string;
  }): void {
    if (option.edit && this.selectedUser) {
      this.showEditModal = true;
    } else if (option.view) {
    } else if (option.delete && this.selectedUser) {
    }

    this.selectedUser = null;
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

    // fetchSpecializations();
    // this.users = [
    //   {
    //     profilePicture: '',
    //     firstName: 'John',
    //     lastName: 'Doe',
    //     email: 'john@example.com',
    //     roles: 'Basic User',
    //     department: 'Service Center',
    //     specializations: [],
    //   },
    //   {
    //     profilePicture: '',
    //     firstName: 'John',
    //     lastName: 'Doe',
    //     email: 'john@example.com',
    //     roles: 'Basic User',
    //     department: 'Service Center',
    //     specializations: [],
    //   },
    //   {
    //     profilePicture: '',
    //     firstName: 'John',
    //     lastName: 'Doe',
    //     email: 'john@example.com',
    //     roles: 'Basic User',
    //     department: 'Service Center',
    //     specializations: [],
    //   },
    //   {
    //     profilePicture: '',
    //     firstName: 'John',
    //     lastName: 'Doe',
    //     email: 'john@example.com',
    //     roles: 'Basic User',
    //     department: 'Service Center',
    //     specializations: [],
    //   },
    //   {
    //     profilePicture: '',
    //     firstName: 'John',
    //     lastName: 'Doe',
    //     email: 'john@example.com',
    //     roles: 'Basic User',
    //     department: 'Service Center',
    //     specializations: [],
    //   },
    //   {
    //     profilePicture: '',
    //     firstName: 'John',
    //     lastName: 'Doe',
    //     email: 'john@example.com',
    //     roles: 'Basic User',
    //     department: 'Service Center',
    //     specializations: [],
    //   },
    //   {
    //     profilePicture: '',
    //     firstName: 'John',
    //     lastName: 'Doe',
    //     email: 'john@example.com',
    //     roles: 'Basic User',
    //     department: 'Service Center',
    //     specializations: [],
    //   },
    //   {
    //     profilePicture: '',
    //     firstName: 'John',
    //     lastName: 'Doe',
    //     email: 'john@example.com',
    //     roles: 'Basic User',
    //     department: 'Service Center',
    //     specializations: [],
    //   },
    // ];
  }

  createUser(): void {
    this.userCreationService.createUser(this.newUser).subscribe({
      next: createdUser => {
        this.users.push(createdUser);
        this.newUser = {
          firstName: '',
          lastName: '',
          userId: '',
          phoneNumber: '',
          changePassword: false,
          profilePicture: '',
          specializations: [],
          email: '',
          roles: 'Basic User',
          department: 'Service Center',
        };
      },
      error: error => {
        console.error('Error creating user:', error);
      },
    });
  }
}
