import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { GenericResponse, User } from '../../../../shared/types/types';

@Component({
  selector: 'archived-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './archived-list.component.html',
  styleUrls: ['./archived-list.component.css'],
})
export class ArchivedListComponent implements OnInit {
  archivedUsers: User[] = [];
  loading: boolean = true;
  showDropdownForUser: User | null = null;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.fetchArchivedUsers();
  }

  toggleDropdown(user: User): void {
    this.showDropdownForUser = this.showDropdownForUser === user ? null : user;
  }

  fetchArchivedUsers(): void {
    this.loading = true;
    this.usersService.archivedUsers().subscribe({
      next: (response: any) => {
        const archivedUsers = response?.archives || [];
        if (Array.isArray(archivedUsers)) {
          this.archivedUsers = archivedUsers as User[];
        } else {
          console.error('Invalid archived users format:', archivedUsers);
        }
      },
      error: error => {
        console.error('Error fetching archived users:', error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  restoreUser(email: string): void {
    this.usersService.restoreUser(email).subscribe(
      (response: GenericResponse) => {
        console.log('User restored successfully:', response);
        this.fetchArchivedUsers();
      },
      error => {
        console.error('Error restoring user:', error);
      }
    );
  }
  // restoreUser(email: string): void {
  //   this.usersService.restoreUser(email).subscribe({
  //     next: (response: any) => {
  //       console.log('User restored successfully:', response);
  //       //       this.fetchArchivedUsers();
  //       //     },
  //       //     error => {
  //       //       console.error('Error restoring user:', error);
  //       //     }
  //     },
  //   });
}
