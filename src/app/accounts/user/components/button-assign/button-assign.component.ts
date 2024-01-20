import { CommonModule } from '@angular/common';
import {
  Component,
  ComponentRef,
  EventEmitter,
  Input,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { AssignModalComponent } from '../../../../shared/components/modals/assign-modal/assign-modal.component';
import { AssignModalService } from '../../../../shared/components/modals/assign-modal/assign.service';
import { User } from '../../../../shared/types/types';
@Component({
  selector: 'button-assign',
  standalone: true,
  imports: [CommonModule, AssignModalComponent],
  templateUrl: './button-assign.component.html',
  styleUrl: './button-assign.component.css',
})
export class ButtonAssignComponent {
  @Output() selectedUsers = new EventEmitter<User[]>();
  @Input() user!: User;

  private assignModalRef?: ComponentRef<AssignModalComponent>;

  constructor(
    private assignModalService: AssignModalService,
    private viewContainerRef: ViewContainerRef
  ) {}

  openAssignModal(user: User) {
    const modalComponentRef = this.assignModalService.open(
      this.viewContainerRef,
      { user }
    );

    modalComponentRef.instance.selectedUsersEvent.subscribe(
      (selectedUsers: User[]) => {
        this.selectedUsers.emit(selectedUsers);
      }
    );
  }
}
