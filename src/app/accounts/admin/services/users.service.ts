import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../../../../environment/config';
import { Observable } from 'rxjs';
import { GenericResponse, User } from '../../../shared/types/types';

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

  deleteUser(email: string): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(
      `${BASE_URL}/users/settings/delete`,
      { email: email }
    );
  }

  getBookableUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${BASE_URL}/users/fetch/bookable`, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'skip-browser-warning',
      },
    });
  }
}
