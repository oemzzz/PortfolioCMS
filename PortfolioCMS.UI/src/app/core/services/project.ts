import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Project {
  id: number;
  titleTr: string;
  titleEn: string;
  descriptionTr: string;
  descriptionEn: string;
  category: string;
  techStack: string;
  githubUrl: string;
  liveUrl: string;
  imageUrl: string;
  year?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/Projects`;

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  // Yeni proje ekleme (POST)
  createProject(project: Omit<Project, 'id'>): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  // Proje güncelleme (PUT)
  updateProject(id: number, project: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, project);
  }

  // Proje silme (DELETE)
  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}