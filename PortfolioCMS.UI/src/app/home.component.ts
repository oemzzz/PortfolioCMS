import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Project, ProjectService } from './core/services/project';
import { Skill, SkillService } from './core/services/skill';
import { Education, EducationService } from './core/services/education';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <h1>🎓 Eğitim</h1>
    <div style="margin-bottom: 40px;">
      @for (edu of educations; track edu.id) {
        <div style="border: 1px solid #ccc; padding: 15px; margin-bottom: 15px; border-radius: 5px; background: #f9f9f9;">
          <h3 style="margin: 0 0 5px 0;">
            {{ edu.schoolNameTr }}
            @if (edu.isExchange) {
              <span style="font-size: 12px; background: #ffc107; color: #333; padding: 2px 8px; border-radius: 10px; margin-left: 8px;">Erasmus</span>
            }
          </h3>
          <p style="margin: 0 0 5px 0; color: #555;">{{ edu.departmentTr }}</p>
          <small style="color: gray;">{{ edu.startYear }} - {{ edu.endYear || 'Devam ediyor' }}</small>
          @if (edu.descriptionTr) {
            <p style="margin: 8px 0 0 0; font-size: 14px;">{{ edu.descriptionTr }}</p>
          }
        </div>
      } @empty {
        <p style="color: gray;">Yakında eklenecek...</p>
      }
    </div>

    <hr style="margin: 40px 0;" />

    <h1>🛠️ Yeteneklerim</h1>
    <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 40px;">
      @for (skill of skills; track skill.id) {
        <span style="background: #007bff; color: white; padding: 6px 14px; border-radius: 20px; font-size: 14px;">
          {{ skill.name }}
        </span>
      } @empty {
        <p style="color: gray;">Yakında eklenecek...</p>
      }
    </div>

    <hr style="margin: 40px 0;" />

    <h1>🚀 Projelerim</h1>
    @for (project of projects; track project.id) {
      <div style="border: 1px solid #ccc; padding: 15px; margin-bottom: 15px; border-radius: 5px; background: #f9f9f9;">
        <h2>{{ project.titleTr }} <span style="font-size: 14px; color: gray;">({{ project.category }})</span></h2>
        <p>{{ project.descriptionTr }}</p>
        <small style="color: #007bff; font-weight: bold;">Teknolojiler: {{ project.techStack }}</small>
      </div>
    } @empty {
      <p>Proje bulunmuyor...</p>
    }
  `
})
export class HomeComponent implements OnInit {
  projects: Project[] = [];
  skills: Skill[] = [];
  educations: Education[] = [];

  constructor(
    private projectService: ProjectService,
    private skillService: SkillService,
    private educationService: EducationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe(data => {
      this.projects = data;
      this.cdr.detectChanges();
    });

    this.skillService.getSkills().subscribe(data => {
      this.skills = data;
      this.cdr.detectChanges();
    });

    this.educationService.getEducations().subscribe(data => {
      this.educations = data;
      this.cdr.detectChanges();
    });
  }
}