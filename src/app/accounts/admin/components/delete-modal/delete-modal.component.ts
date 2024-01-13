import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { selectCurrentUser } from '../../../../auth/store/authorization/AuthReducers';
import { CurrentUser } from '../../../../shared/types/types';
import { Store } from '@ngrx/store';

@Component({
  selector: 'delete-modal',
  standalone: true,
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css'],
})
export class DeleteModalComponent implements OnInit {
  @Input() userEmailToDelete: string = '';
  user!: CurrentUser;

  @Output() cancel = new EventEmitter<void>();
  @Output() deleteConfirmed = new EventEmitter<string>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.select(selectCurrentUser).subscribe({
      next: user => {
        if (user) this.user = user;
      },
    });
  }

  confirmDelete(): void {
    // Trigger the deleteConfirmed event with the userEmailToDelete
    this.deleteConfirmed.emit(this.userEmailToDelete);
  }

  closeDeleteModal(): void {
    // Trigger the cancel event
    this.cancel.emit();
  }
}
