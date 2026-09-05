import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AcademicPaper {
  id: number;
  titleTr: string;
  titleEn: string;
  abstractTr: string;
  abstractEn: string;
  doiNumber?: string;
  journalName: string;
  status: string;
  coAuthors?: string;
  publishedDate?: string;
}

@Injectable({ providedIn: 'root' })
export class AcademicPaperService {
  private apiUrl = `${environment.apiUrl}/AcademicPapers`;

  constructor(private http: HttpClient) {}

  getPapers(): Observable<AcademicPaper[]> { 
    return this.http.get<AcademicPaper[]>(this.apiUrl); 
  }
  
  createPaper(paper: Omit<AcademicPaper, 'id'>): Observable<AcademicPaper> { 
    return this.http.post<AcademicPaper>(this.apiUrl, paper); 
  }
  updatePaper(id: number, paper: Partial<AcademicPaper>): Observable<AcademicPaper> {
  return this.http.put<AcademicPaper>(`${this.apiUrl}/${id}`, paper);
}
  
  deletePaper(id: number): Observable<void> { 
    return this.http.delete<void>(`${this.apiUrl}/${id}`); 
  }
}