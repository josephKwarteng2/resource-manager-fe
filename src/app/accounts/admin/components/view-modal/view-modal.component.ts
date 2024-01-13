import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from '../../../../shared/types/types';

@Component({
  selector: 'view-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-modal.component.html',
  styleUrl: './view-modal.component.css',
})
export class ViewModalComponent implements OnInit {
  selectedUser: User | null = null;

  showViewModal = false;

  ngOnInit(): void {}

  activeView = 'general';

  toggleView(view: string) {
    this.activeView = view;
  }

  openModal(user: User): void {
    this.selectedUser = user;
    this.showViewModal = true;
  }

  closeModal(): void {
    this.selectedUser = null;
    this.showViewModal = false;
  }
}
