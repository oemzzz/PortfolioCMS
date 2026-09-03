import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Project, ProjectService } from './core/services/project';
import { Skill, SkillService } from './core/services/skill';
import { AuthService } from './core/services/auth';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div style="display: flex; justify-content: space-between; align-items: center; background: #385723; color: white; padding: 10px 15px; border-radius: 5px; margin-bottom: 20px;">
      <span style="font-weight: bold;">✔ Admin Paneli Aktif</span>
      <button (click)="onLogout()" style="padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">Çıkış Yap</button>
    </div>

    <!-- SKILLS YÖNETİMİ -->
    <div style="background: #fdfdfd; border: 1px solid #ddd; padding: 15px; border-radius: 5px; margin-bottom: 25px;">
      <h3>🛠️ Yetenek Yönetimi</h3>
      <div style="display: flex; gap: 8px; margin-bottom: 15px;">
        <input type="text" [(ngModel)]="newSkillName" placeholder="Yetenek adı (örn: Angular)"
               style="flex: 1; padding: 6px; box-sizing: border-box;" />
        <button (click)="onAddSkill()" style="padding: 6px 14px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Ekle</button>
      </div>
      @if (skillError) { <p style="color: red; margin: 0 0 10px 0;">{{ skillError }}</p> }
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        @for (skill of skills; track skill.id) {
          <span style="background: #e9ecef; padding: 6px 10px; border-radius: 20px; font-size: 14px; display: flex; align-items: center; gap: 6px;">
            {{ skill.name }}
            <button (click)="onDeleteSkill(skill.id)" style="background: none; border: none; color: #dc3545; cursor: pointer; font-weight: bold;">✕</button>
          </span>
        } @empty {
          <p style="color: gray; margin: 0;">Henüz yetenek eklenmedi.</p>
        }
      </div>
    </div>

    <!-- PROJE YÖNETİMİ -->
    <div style="background: #fdfdfd; border: 1px solid #ddd; padding: 15px; border-radius: 5px; margin-bottom: 25px;">
      <h3>{{ isEditing ? '✏️ Projeyi Düzenle' : '➕ Yeni Proje Ekle' }}</h3>
      <input type="text" [(ngModel)]="newProject.titleTr" placeholder="Proje Başlığı (TR)" style="display:block; width:100%; margin-bottom:8px; padding:6px; box-sizing: border-box;" />
      <input type="text" [(ngModel)]="newProject.titleEn" placeholder="Proje Başlığı (EN)" style="display:block; width:100%; margin-bottom:8px; padding:6px; box-sizing: border-box;" />
      <input type="text" [(ngModel)]="newProject.category" placeholder="Kategori" style="display:block; width:100%; margin-bottom:8px; padding:6px; box-sizing: border-box;" />
      <textarea [(ngModel)]="newProject.descriptionTr" placeholder="Açıklama (TR)" style="display:block; width:100%; margin-bottom:8px; padding:6px; height: 60px; box-sizing: border-box;"></textarea>
      <textarea [(ngModel)]="newProject.descriptionEn" placeholder="Açıklama (EN)" style="display:block; width:100%; margin-bottom:8px; padding:6px; height: 60px; box-sizing: border-box;"></textarea>
      <input type="text" [(ngModel)]="newProject.techStack" placeholder="Teknolojiler" style="display:block; width:100%; margin-bottom:10px; padding:6px; box-sizing: border-box;" />

      <div style="display: flex; gap: 10px;">
        @if (isEditing) {
          <button (click)="onUpdateProject()" style="padding: 8px 15px; background: #ffc107; border: none; border-radius: 4px; cursor: pointer;">Güncelle</button>
          <button (click)="cancelEdit()" style="padding: 8px 15px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">İptal</button>
        } @else {
          <button (click)="onAddProject()" style="padding: 8px 15px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">Kaydet</button>
        }
      </div>
      @if (addError) { <p style="color: red; margin-top: 8px; white-space: pre-wrap;">{{ addError }}</p> }
    </div>

    <hr style="margin: 20px 0;" />
    <h2>Yönetilen Projeler</h2>
    @for (project of projects; track project.id) {
      <div style="border: 1px solid #ccc; padding: 15px; margin-bottom: 10px; border-radius: 5px; display: flex; justify-content: space-between; align-items: flex-start;">
        <div><h3 style="margin: 0 0 5px 0;">{{ project.titleTr }}</h3><small>{{ project.techStack }}</small></div>
        <div style="display: flex; gap: 8px;">
          <button (click)="onEditProject(project)" style="background: #ffc107; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Düzenle</button>
          <button (click)="onDeleteProject(project.id)" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Sil</button>
        </div>
      </div>
    }
  `
})
export class AdminComponent implements OnInit {
  projects: Project[] = [];
  skills: Skill[] = [];
  newSkillName = '';
  skillError = '';

  addError = '';
  isEditing = false;
  editingProjectId: number | null = null;
  newProject = this.getEmptyProject();

  constructor(
    private projectService: ProjectService,
    private skillService: SkillService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadSkills();
  }

  getEmptyProject() {
    return { titleTr: '', titleEn: '', descriptionTr: '', descriptionEn: '', category: '', techStack: '', githubUrl: '', liveUrl: '', imageUrl: '' };
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe(data => { this.projects = data; this.cdr.detectChanges(); });
  }

  loadSkills(): void {
    this.skillService.getSkills().subscribe(data => { this.skills = data; this.cdr.detectChanges(); });
  }

  onAddSkill(): void {
    this.skillError = '';
    if (!this.newSkillName.trim()) {
      this.skillError = 'Yetenek adı boş olamaz.';
      return;
    }
    this.skillService.createSkill({ name: this.newSkillName.trim() }).subscribe({
      next: () => {
        this.newSkillName = '';
        this.loadSkills();
      },
      error: (err) => {
        this.skillError = err.error?.errors
          ? Object.values(err.error.errors).flat().join(', ')
          : 'Yetenek eklenirken hata oluştu.';
        this.cdr.detectChanges();
      }
    });
  }

  onDeleteSkill(id: number): void {
    if (confirm('Bu yeteneği silmek istediğinize emin misiniz?')) {
      this.skillService.deleteSkill(id).subscribe(() => this.loadSkills());
    }
  }

  onLogout(): void { this.authService.logout(); this.router.navigate(['/']); }

  onAddProject(): void {
    this.addError = '';
    this.projectService.createProject(this.newProject).subscribe({
      next: () => { this.newProject = this.getEmptyProject(); this.loadProjects(); },
      error: (err) => this.handleApiError(err)
    });
  }

  onEditProject(project: Project): void {
    this.isEditing = true; this.editingProjectId = project.id;
    this.newProject = { ...project, githubUrl: project.githubUrl || '', liveUrl: project.liveUrl || '', imageUrl: project.imageUrl || '' };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onUpdateProject(): void {
    if (!this.editingProjectId) return;
    this.addError = '';
    this.projectService.updateProject(this.editingProjectId, { ...this.newProject, id: this.editingProjectId }).subscribe({
      next: () => { this.cancelEdit(); this.loadProjects(); },
      error: (err) => this.handleApiError(err)
    });
  }

  cancelEdit(): void { this.isEditing = false; this.editingProjectId = null; this.newProject = this.getEmptyProject(); this.addError = ''; }

  onDeleteProject(id: number): void {
    if (confirm('Silmek istediğinize emin misiniz?')) { this.projectService.deleteProject(id).subscribe(() => this.loadProjects()); }
  }

  private handleApiError(err: any): void {
    if (err.error?.errors) { this.addError = Object.entries(err.error.errors).map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`).join('\n'); }
    else { this.addError = 'Hata oluştu.'; }
    this.cdr.detectChanges();
  }
}