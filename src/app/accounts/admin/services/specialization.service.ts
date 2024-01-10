// specialization.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BASE_URL } from '../../../../environment/config';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SpecializationService {
  private _specializations: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);
  specializations$ = this._specializations.asObservable();

  constructor(private http: HttpClient) {
    this._specializations.next([]);
  }

  addSpecialization(specialization: string): Observable<any> {
    const currentSpecializations = this._specializations.getValue();
    const updatedSpecializations = [...currentSpecializations, specialization];
    console.log('Updated Specializations:', updatedSpecializations);
    this._specializations.next(updatedSpecializations);

    return this.http
      .post<any>(`${BASE_URL}/specialization/store`, { name: specialization })
      .pipe(
        catchError(error => {
          
          console.error('Error adding specialization to the backend:', error);
          
          this._specializations.next(currentSpecializations);

          return throwError(error);
        })
      );
  }

  getSpecializations(): Observable<string[]> {
    return this.http
      .get<string[]>(`${BASE_URL}/specialization/fetch`, {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'skip-browser-warning',
        },
      })

      .pipe(
        catchError(error => {
          console.error('Error fetching specializations:', error);
          return throwError(error); 
        })
      );
  }

  setSpecializations(specializations: string[]) {
    this._specializations.next(specializations);
  }
}
