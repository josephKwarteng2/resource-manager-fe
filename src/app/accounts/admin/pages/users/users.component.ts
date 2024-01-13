import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SideNavComponent } from '../../../../shared/components/side-nav/side-nav.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { ButtonAssignComponent } from '../../../user/components/button-assign/button-assign.component';
import { ButtonNewComponent } from '../../../user/components/button-new/button-new.component';
import { UserListComponent } from '../../components/user-list/user-list.component';
import { UsercreationComponent } from '../usercreation/usercreation.component';
import { ManagerUsercreationComponent } from '../../../manager/pages/manager-usercreation/manager-usercreation.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    SideNavComponent,
    HeaderComponent,
    ButtonAssignComponent,
    ButtonNewComponent,
    UserListComponent,
    UsercreationComponent,
    ManagerUsercreationComponent

  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
    userCreationModalOpen = false;

  openUserCreationModal() {
    this.userCreationModalOpen = true;
  }

}
