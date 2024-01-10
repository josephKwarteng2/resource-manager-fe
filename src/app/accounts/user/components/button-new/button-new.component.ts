import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'button-new',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-new.component.html',
  styleUrl: './button-new.component.css',
})
export class ButtonNewComponent {
  constructor(private router: Router) {}
  openUserCreationForm() {
    this.router.navigate(['/admin/create-user']);
  }
}
