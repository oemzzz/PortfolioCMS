import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Education {
  id: number;
  schoolNameTr: string;
  schoolNameEn: string;
  departmentTr: string;
  departmentEn: string;
  descriptionTr?: string;
  descriptionEn?: string;
  startYear: number;
  endYear?: number;
  isExchange: boolean;
}

@Injectable({ providedIn: 'root' })
export class EducationService {
  private apiUrl = `${environment.apiUrl}/Educations`;

  constructor(private http: HttpClient) {}

  getEducations(): Observable<Education[]> {
    return this.http.get<Education[]>(this.apiUrl);
  }

  createEducation(edu: Omit<Education, 'id'>): Observable<Education> {
    return this.http.post<Education>(this.apiUrl, edu);
  }

  updateEducation(id: number, edu: Omit<Education, 'id'>): Observable<Education> {
    return this.http.put<Education>(`${this.apiUrl}/${id}`, edu);
  }

  deleteEducation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
