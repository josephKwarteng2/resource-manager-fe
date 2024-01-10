import { Injectable } from '@angular/core';
import { BASE_URL } from '../../../environment/config';
import { UserNotifications } from '../types/types';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(private http: HttpClient) {}

  getNotifications(): Observable<UserNotifications> {
    return this.http.get<UserNotifications>(
      `${BASE_URL}/users/notifications/fetch`,
      {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'skip-browser-warning',
        },
      }
    );
  }
}
