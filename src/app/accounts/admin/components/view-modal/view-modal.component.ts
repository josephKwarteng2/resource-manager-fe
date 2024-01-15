import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../../../shared/types/types';

@Component({
  selector: 'view-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-modal.component.html',
  styleUrl: './view-modal.component.css',
})
export class ViewModalComponent implements OnInit {
  @Input() user!: User;
  display: 'general' | 'normal-avaliability' = 'general';
  closed: boolean = false;
  opening: boolean = true;

  @Output() closeEvent = new EventEmitter<void>();
  @Output() submitEvent = new EventEmitter<void>();

  close() {
    this.closed = true;
    this.closeEvent.emit();
  }

  edit() {
    /**
     * do something to edit the user
     */
  }

  submit() {
    /**
     * Access the user to make an api call before the last line
     */
    this.submitEvent.emit();
  }

  /**
   * Just animations for modal fading in and out
   */
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
