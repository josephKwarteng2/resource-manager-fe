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
    return this.http.get<User[]>(`${BASE_URL}/users/fetch/?query=20`, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'skip-browser-warning',
      },
    });
  }
  //delete users from the system
  deleteUser(email: string): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(`${BASE_URL}/users/delete`, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'skip-browser-warning',
      },
      params: {
        email: email,
      },
    });
  }

  getBookableUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${BASE_URL}/users/fetch/bookable`, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'skip-browser-warning',
      },
    });
  }

  //moves users to archive
  archiveUser(email: string): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(`${BASE_URL}/users/delete`, {
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'skip-browser-warning',
      },
      params: {
        email: email,
      },
    });
  }

  archivedUsers(): Observable<User[]> {
    return new Observable(observer => {
      this.http
        .get<User[]>(`${BASE_URL}/users/archives/fetch`, {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'skip-browser-warning',
          },
        })
        .subscribe({
          next: (archivedUsers: User[]) => {
            observer.next(archivedUsers);
          },
          error: error => {
            observer.error(error);
          },
          complete: () => {
            observer.complete();
          },
        });
    });
  }

  restoreUser(email: string): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(
      `${BASE_URL}/users/archives/restore`,
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'skip-browser-warning',
        },
      }
    );
  }
}
