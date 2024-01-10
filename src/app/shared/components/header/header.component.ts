import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from '../search/search.component';
import { CdkMenuModule } from '@angular/cdk/menu';
import { NotificationsService } from '../../services/notifications.service';
import { UserNotifications } from '../../types/types';

@Component({
  selector: 'rm-header',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchComponent, CdkMenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  query: string = '';
  notifications: UserNotifications[] = [];
  isOnline: boolean = navigator.onLine;

  constructor(private notificationService: NotificationsService) {}

  ngOnInit() {
    window.addEventListener('online', () => this.updateOnlineStatus(true));
    window.addEventListener('offline', () => this.updateOnlineStatus(false));

    // Fetch notifications when the component initializes
    this.fetchNotifications();
  }

  private updateOnlineStatus(online: boolean) {
    this.isOnline = online;
  }

  performSearch() {}

  private fetchNotifications() {
    this.notificationService.getNotifications().subscribe(
      (response: any) => {
        const notifications = response.notifications || response.data;
        console.log(notifications);
        if (Array.isArray(notifications)) {
          this.notifications = notifications as UserNotifications[];
        } else {
          console.log('Invalid notifications format for users', notifications);
        }
      },
      error => {
        console.log('Error fetching users', error);
      }
    );
  }

  markAllAsRead() {}
}
