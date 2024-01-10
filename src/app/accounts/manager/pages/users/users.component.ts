import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserListComponent } from '../../../admin/components/user-list/user-list.component';
import { ButtonAssignComponent } from '../../../user/components/button-assign/button-assign.component';
import { ButtonNewComponent } from '../../../user/components/button-new/button-new.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    UserListComponent,
    ButtonAssignComponent,
    ButtonNewComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {}
