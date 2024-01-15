import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../../shared/types/types';

@Component({
  selector: 'delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.css',
})
export class DeleteModalComponent {
  @Input() user!: User | undefined;
  closed: boolean = false;
  opening: boolean = true;

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
