import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../../../environment/config';
import { Observable } from 'rxjs';
import { User } from '../../../shared/types/types';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${BASE_URL}/users/fetch`, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'skip-browser-warning',
      },
    });
  }
}
