import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Project, ProjectService } from './core/services/project';
import { Skill, SkillService } from './core/services/skill';
import { Education, EducationService } from './core/services/education';
import { AcademicPaper, AcademicPaperService } from './core/services/academic-paper';
import { AuthService } from './core/services/auth';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#0a0c10] text-gray-200 p-6 md:p-12">
      
      <!-- TOP BAR -->
      <div class="max-w-7xl mx-auto flex justify-between items-center pb-8 border-b border-gray-800 mb-10">
        <div>
          <span class="text-xs font-mono uppercase tracking-widest text-amber-400">Yönetim Paneli</span>
          <h1 class="text-3xl font-black text-white mt-1">Dashboard.</h1>
        </div>
        <div class="flex items-center gap-4">
          <a routerLink="/" class="text-sm font-medium text-gray-400 hover:text-white transition">Siteye Dön ↗</a>
          <button (click)="logout()" class="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-semibold rounded-xl border border-red-500/20 transition">
            Çıkış Yap
          </button>
        </div>
      </div>

      <div class="max-w-7xl mx-auto">
        
        <!-- TABS -->
        <div class="flex gap-2 border-b border-gray-800 mb-8 overflow-x-auto pb-px">
          <button (click)="activeTab = 'projects'" 
                  [class.border-amber-400]="activeTab === 'projects'"
                  [class.text-white]="activeTab === 'projects'"
                  [class.text-gray-500]="activeTab !== 'projects'"
                  class="pb-4 px-6 font-semibold border-b-2 transition whitespace-nowrap">
            Projeler ({{ projects.length }})
          </button>
          <button (click)="activeTab = 'skills'" 
                  [class.border-amber-400]="activeTab === 'skills'"
                  [class.text-white]="activeTab === 'skills'"
                  [class.text-gray-500]="activeTab !== 'skills'"
                  class="pb-4 px-6 font-semibold border-b-2 transition whitespace-nowrap">
            Yetenekler ({{ skills.length }})
          </button>
          <button (click)="activeTab = 'education'" 
                  [class.border-amber-400]="activeTab === 'education'"
                  [class.text-white]="activeTab === 'education'"
                  [class.text-gray-500]="activeTab !== 'education'"
                  class="pb-4 px-6 font-semibold border-b-2 transition whitespace-nowrap">
            Eğitim ({{ educations.length }})
          </button>
          <button (click)="activeTab = 'papers'" 
                  [class.border-amber-400]="activeTab === 'papers'"
                  [class.text-white]="activeTab === 'papers'"
                  [class.text-gray-500]="activeTab !== 'papers'"
                  class="pb-4 px-6 font-semibold border-b-2 transition whitespace-nowrap">
            Akademik Yayınlar ({{ papers.length }})
          </button>
        </div>

        <!-- TAB 1: PROJELER -->
        @if (activeTab === 'projects') {
          <div class="space-y-6">
            <div class="bg-[#12161f] border border-gray-800/80 rounded-3xl p-6 md:p-8">
              <h2 class="text-xl font-bold text-white mb-6">{{ editingProject ? 'Projeyi Düzenle' : 'Yeni Proje Ekle' }}</h2>
              <form (ngSubmit)="editingProject ? updateProject() : createProject()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" [(ngModel)]="formProject.titleTr" name="titleTr" placeholder="Proje Adı (TR)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="text" [(ngModel)]="formProject.titleEn" name="titleEn" placeholder="Proje Adı (EN)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="text" [(ngModel)]="formProject.category" name="category" placeholder="Kategori (Örn: Full Stack)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="text" [(ngModel)]="formProject.techStack" name="techStack" placeholder="Teknolojiler (Virgülle ayırın)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="text" [(ngModel)]="formProject.githubUrl" name="githubUrl" placeholder="GitHub URL" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400">
                <input type="text" [(ngModel)]="formProject.liveUrl" name="liveUrl" placeholder="Canlı Demo URL" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400">
                <textarea [(ngModel)]="formProject.descriptionTr" name="descriptionTr" placeholder="Açıklama (TR)" rows="3" class="md:col-span-2 bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required></textarea>
                <textarea [(ngModel)]="formProject.descriptionEn" name="descriptionEn" placeholder="Açıklama (EN)" rows="3" class="md:col-span-2 bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required></textarea>
                
                <div class="md:col-span-2 flex gap-3">
                  <button type="submit" class="flex-1 py-3 bg-amber-400 text-gray-950 font-bold rounded-xl hover:bg-amber-300 transition">
                    {{ editingProject ? 'Güncellemeyi Kaydet' : 'Projeyi Kaydet' }}
                  </button>
                  @if (editingProject) {
                    <button type="button" (click)="cancelEditProject()" class="px-6 py-3 bg-gray-800 text-gray-300 font-bold rounded-xl hover:bg-gray-700 transition">İptal</button>
                  }
                </div>
              </form>
            </div>

            <div class="bg-[#12161f] border border-gray-800/80 rounded-3xl p-6 md:p-8">
              <h2 class="text-xl font-bold text-white mb-6">Mevcut Projeler</h2>
              <div class="space-y-4">
                @for (p of projects; track p.id) {
                  <div class="flex justify-between items-center bg-[#0a0c10] border border-gray-800/60 p-4 rounded-2xl">
                    <div>
                      <h4 class="font-bold text-white">{{ p.titleTr }}</h4>
                      <p class="text-xs text-gray-500 mt-1">{{ p.category }} • {{ p.techStack }}</p>
                    </div>
                    <div class="flex gap-2">
                      <button (click)="startEditProject(p)" class="px-3 py-1.5 bg-amber-500/10 text-amber-400 rounded-xl hover:bg-amber-500/20 text-xs font-semibold">Düzenle</button>
                      <button (click)="deleteProject(p.id)" class="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 text-xs font-semibold">Sil</button>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        }

        <!-- TAB 2: YETENEKLER -->
        @if (activeTab === 'skills') {
          <div class="space-y-6">
            <div class="bg-[#12161f] border border-gray-800/80 rounded-3xl p-6 md:p-8">
              <h2 class="text-xl font-bold text-white mb-6">Yeni Yetenek Ekle</h2>
              <form (ngSubmit)="createSkill()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" [(ngModel)]="newSkill.name" name="name" placeholder="Yetenek Adı (Örn: C#, Angular)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="text" [(ngModel)]="newSkill.category" name="category" placeholder="Kategori (Örn: Backend, Frontend)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <button type="submit" class="md:col-span-2 py-3 bg-amber-400 text-gray-950 font-bold rounded-xl hover:bg-amber-300 transition">Yetenek Ekle</button>
              </form>
            </div>

            <div class="bg-[#12161f] border border-gray-800/80 rounded-3xl p-6 md:p-8">
              <h2 class="text-xl font-bold text-white mb-6">Mevcut Yetenekler</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @for (s of skills; track s.id) {
                  <div class="flex justify-between items-center bg-[#0a0c10] border border-gray-800/60 p-4 rounded-2xl">
                    @if (editingSkill?.id !== s.id) {
                      <div>
                        <h4 class="font-bold text-white">{{ s.name }}</h4>
                        <p class="text-xs text-gray-500 mt-1">{{ s.category }}</p>
                      </div>
                      <div class="flex gap-2">
                        <button (click)="startEditSkill(s)" class="px-3 py-1.5 bg-amber-500/10 text-amber-400 rounded-xl hover:bg-amber-500/20 text-xs font-semibold">Düzenle</button>
                        <button (click)="deleteSkill(s.id)" class="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 text-xs font-semibold">Sil</button>
                      </div>
                    } @else {
                      <div class="flex flex-wrap gap-2 w-full items-center">
                        <input type="text" [(ngModel)]="editingSkill!.name" name="editName" class="flex-1 bg-[#12161f] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm" placeholder="Yetenek Adı">
                        <input type="text" [(ngModel)]="editingSkill!.category" name="editCat" class="bg-[#12161f] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm" placeholder="Kategori">
                        <button (click)="saveEditSkill()" class="px-3 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-xs font-bold transition">Kaydet</button>
                        <button (click)="cancelEditSkill()" class="px-3 py-2 bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 rounded-lg text-xs font-bold transition">İptal</button>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        }

        <!-- TAB 3: EĞİTİM -->
        @if (activeTab === 'education') {
          <div class="space-y-6">
            <div class="bg-[#12161f] border border-gray-800/80 rounded-3xl p-6 md:p-8">
              <h2 class="text-xl font-bold text-white mb-6">{{ editingEducation ? 'Eğitim Bilgisini Düzenle' : 'Eğitim Bilgisi Ekle' }}</h2>
              <form (ngSubmit)="editingEducation ? updateEducation() : createEducation()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" [(ngModel)]="formEducation.schoolNameTr" name="schoolNameTr" placeholder="Okul / Üniversite (TR)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="text" [(ngModel)]="formEducation.schoolNameEn" name="schoolNameEn" placeholder="Okul / Üniversite (EN)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="text" [(ngModel)]="formEducation.departmentTr" name="departmentTr" placeholder="Bölüm (TR)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="text" [(ngModel)]="formEducation.departmentEn" name="departmentEn" placeholder="Bölüm (EN)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="number" [(ngModel)]="formEducation.startYear" name="startYear" placeholder="Başlangıç Yılı" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="number" [(ngModel)]="formEducation.endYear" name="endYear" placeholder="Bitiş Yılı (Opsiyonel)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400">
                <label class="md:col-span-2 flex items-center gap-3 text-sm text-gray-300">
                  <input type="checkbox" [(ngModel)]="formEducation.isExchange" name="isExchange" class="size-4 accent-amber-400">
                  Erasmus / değişim programı
                </label>
                
                <div class="md:col-span-2 flex gap-3">
                  <button type="submit" class="flex-1 py-3 bg-amber-400 text-gray-950 font-bold rounded-xl hover:bg-amber-300 transition">
                    {{ editingEducation ? 'Güncellemeyi Kaydet' : 'Eğitim Bilgisi Ekle' }}
                  </button>
                  @if (editingEducation) {
                    <button type="button" (click)="cancelEditEducation()" class="px-6 py-3 bg-gray-800 text-gray-300 font-bold rounded-xl hover:bg-gray-700 transition">İptal</button>
                  }
                </div>
              </form>
            </div>

            <div class="bg-[#12161f] border border-gray-800/80 rounded-3xl p-6 md:p-8">
              <h2 class="text-xl font-bold text-white mb-6">Kayıtlı Eğitimler</h2>
              <div class="space-y-4">
                @for (e of educations; track e.id) {
                  <div class="flex justify-between items-center bg-[#0a0c10] border border-gray-800/60 p-4 rounded-2xl">
                    <div>
                      <h4 class="font-bold text-white">{{ e.schoolNameTr }} - {{ e.departmentTr }}</h4>
                      <p class="text-xs text-gray-500 mt-1">{{ e.startYear }} - {{ e.endYear || 'Halen' }}{{ e.isExchange ? ' • Erasmus' : '' }}</p>
                    </div>
                    <div class="flex gap-2">
                      <button (click)="startEditEducation(e)" class="px-3 py-1.5 bg-amber-500/10 text-amber-400 rounded-xl hover:bg-amber-500/20 text-xs font-semibold">Düzenle</button>
                      <button (click)="deleteEducation(e.id)" class="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 text-xs font-semibold">Sil</button>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        }

        <!-- TAB 4: AKADEMİK YAYINLAR -->
        @if (activeTab === 'papers') {
          <div class="space-y-6">
            <div class="bg-[#12161f] border border-gray-800/80 rounded-3xl p-6 md:p-8">
              <h2 class="text-xl font-bold text-white mb-6">{{ editingPaper ? 'Akademik Yayını Düzenle' : 'Akademik Yayın Ekle' }}</h2>
              <form (ngSubmit)="editingPaper ? updatePaper() : createPaper()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" [(ngModel)]="formPaper.titleTr" name="titleTr" placeholder="Makale Başlığı (TR)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="text" [(ngModel)]="formPaper.titleEn" name="titleEn" placeholder="Makale Başlığı (EN)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="text" [(ngModel)]="formPaper.journalName" name="journalName" placeholder="Dergi / Konferans Adı" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="text" [(ngModel)]="formPaper.doiNumber" name="doiNumber" placeholder="DOI Numarası" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="text" [(ngModel)]="formPaper.status" name="status" placeholder="Durum (Örn: Yayınlandı / Kabul Edildi)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="text" [(ngModel)]="formPaper.coAuthors" name="coAuthors" placeholder="Diğer Yazarlar (Opsiyonel)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400">
                <textarea [(ngModel)]="formPaper.abstractTr" name="abstractTr" placeholder="Özet (TR)" rows="3" class="md:col-span-2 bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required></textarea>
                <textarea [(ngModel)]="formPaper.abstractEn" name="abstractEn" placeholder="Özet (EN)" rows="3" class="md:col-span-2 bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required></textarea>
                
                <div class="md:col-span-2 flex gap-3">
                  <button type="submit" class="flex-1 py-3 bg-amber-400 text-gray-950 font-bold rounded-xl hover:bg-amber-300 transition">
                    {{ editingPaper ? 'Güncellemeyi Kaydet' : 'Yayın Ekle' }}
                  </button>
                  @if (editingPaper) {
                    <button type="button" (click)="cancelEditPaper()" class="px-6 py-3 bg-gray-800 text-gray-300 font-bold rounded-xl hover:bg-gray-700 transition">İptal</button>
                  }
                </div>
              </form>
            </div>

            <div class="bg-[#12161f] border border-gray-800/80 rounded-3xl p-6 md:p-8">
              <h2 class="text-xl font-bold text-white mb-6">Kayıtlı Yayınlar</h2>
              <div class="space-y-4">
                @for (p of papers; track p.id) {
                  <div class="flex justify-between items-center bg-[#0a0c10] border border-gray-800/60 p-4 rounded-2xl">
                    <div>
                      <h4 class="font-bold text-white">{{ p.titleTr }}</h4>
                      <p class="text-xs text-gray-500 mt-1">{{ p.journalName }} • DOI: {{ p.doiNumber }}</p>
                    </div>
                    <div class="flex gap-2">
                      <button (click)="startEditPaper(p)" class="px-3 py-1.5 bg-amber-500/10 text-amber-400 rounded-xl hover:bg-amber-500/20 text-xs font-semibold">Düzenle</button>
                      <button (click)="deletePaper(p.id)" class="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 text-xs font-semibold">Sil</button>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        }

      </div>
    </div>
  `
})
export class AdminComponent implements OnInit {
  activeTab: 'projects' | 'skills' | 'education' | 'papers' = 'projects';

  projects: Project[] = [];
  skills: Skill[] = [];
  educations: Education[] = [];
  papers: AcademicPaper[] = [];

  // İlk baştaki gibi yeni kayıt nesneleri ve editing state'leri
  newProject: any = { titleTr: '', titleEn: '', descriptionTr: '', descriptionEn: '', category: '', techStack: '', githubUrl: '', liveUrl: '', year: 2026 };
  editingProject: Project | null = null;
  get formProject() { return this.editingProject || this.newProject; }

  newSkill: any = { name: '', category: '' };
  editingSkill: Skill | null = null;

  newEducation: any = { schoolNameTr: '', schoolNameEn: '', departmentTr: '', departmentEn: '', startYear: null, endYear: null, isExchange: false };
  editingEducation: Education | null = null;
  get formEducation() { return this.editingEducation || this.newEducation; }

  newPaper: any = { titleTr: '', titleEn: '', abstractTr: '', abstractEn: '', doiNumber: '', journalName: '', status: '', coAuthors: '' };
  editingPaper: AcademicPaper | null = null;
  get formPaper() { return this.editingPaper || this.newPaper; }

  constructor(
    private projectService: ProjectService,
    private skillService: SkillService,
    private educationService: EducationService,
    private paperService: AcademicPaperService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.projectService.getProjects().subscribe(d => { this.projects = d; this.cdr.detectChanges(); });
    this.skillService.getSkills().subscribe(d => { this.skills = d; this.cdr.detectChanges(); });
    this.educationService.getEducations().subscribe(d => { this.educations = d; this.cdr.detectChanges(); });
    this.paperService.getPapers().subscribe(d => { this.papers = d; this.cdr.detectChanges(); });
  }

  private sanitizeUrl(url: string | null | undefined): string | null {
    if (!url || url.trim() === '') return null;
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    return cleanUrl;
  }

  // --- PROJE ---
  createProject() {
    const payload = {
      ...this.newProject,
      githubUrl: this.sanitizeUrl(this.newProject.githubUrl),
      liveUrl: this.sanitizeUrl(this.newProject.liveUrl),
      imageUrl: this.sanitizeUrl(this.newProject.imageUrl)
    };
    this.projectService.createProject(payload).subscribe(() => {
      this.loadData();
      this.newProject = { titleTr: '', titleEn: '', descriptionTr: '', descriptionEn: '', category: '', techStack: '', githubUrl: '', liveUrl: '', year: 2026 };
    });
  }

  startEditProject(p: Project) {
    this.editingProject = { ...p };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEditProject() {
    this.editingProject = null;
  }

  updateProject() {
    if (!this.editingProject) return;
    const payload = {
      ...this.editingProject,
      githubUrl: this.sanitizeUrl(this.editingProject.githubUrl),
      liveUrl: this.sanitizeUrl(this.editingProject.liveUrl),
      imageUrl: this.sanitizeUrl(this.editingProject.imageUrl)
    };
    this.projectService.updateProject(this.editingProject.id, payload).subscribe(() => {
      this.loadData();
      this.editingProject = null;
    });
  }

  deleteProject(id: number) {
    this.projectService.deleteProject(id).subscribe(() => this.loadData());
  }

  // --- YETENEK ---
  createSkill() {
    this.skillService.createSkill(this.newSkill).subscribe(() => {
      this.loadData();
      this.newSkill = { name: '', category: '' };
    });
  }

  startEditSkill(s: Skill) {
    this.editingSkill = { ...s };
  }

  cancelEditSkill() {
    this.editingSkill = null;
  }

  saveEditSkill() {
    if (!this.editingSkill) return;
    this.skillService.updateSkill(this.editingSkill.id, this.editingSkill).subscribe(() => {
      this.loadData();
      this.editingSkill = null;
    });
  }

  deleteSkill(id: number) {
    this.skillService.deleteSkill(id).subscribe(() => this.loadData());
  }

  // --- EĞİTİM ---
  createEducation() {
    this.educationService.createEducation(this.newEducation).subscribe(() => {
      this.loadData();
      this.newEducation = { schoolNameTr: '', schoolNameEn: '', departmentTr: '', departmentEn: '', startYear: null, endYear: null, isExchange: false };
    });
  }

  startEditEducation(e: Education) {
    this.editingEducation = { ...e };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEditEducation() {
    this.editingEducation = null;
  }

  updateEducation() {
    if (!this.editingEducation) return;
    this.educationService.updateEducation(this.editingEducation.id, this.editingEducation).subscribe(() => {
      this.loadData();
      this.editingEducation = null;
    });
  }

  deleteEducation(id: number) {
    this.educationService.deleteEducation(id).subscribe(() => this.loadData());
  }

  // --- AKADEMİK YAYIN ---
  createPaper() {
    this.paperService.createPaper(this.newPaper).subscribe(() => {
      this.loadData();
      this.newPaper = { titleTr: '', titleEn: '', abstractTr: '', abstractEn: '', doiNumber: '', journalName: '', status: '', coAuthors: '' };
    });
  }

  startEditPaper(p: AcademicPaper) {
    this.editingPaper = { ...p };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEditPaper() {
    this.editingPaper = null;
  }

  updatePaper() {
    if (!this.editingPaper) return;
    this.paperService.updatePaper(this.editingPaper.id, this.editingPaper).subscribe(() => {
      this.loadData();
      this.editingPaper = null;
    });
  }

  deletePaper(id: number) {
    this.paperService.deletePaper(id).subscribe(() => this.loadData());
  }

  logout() {
    this.authService.logout();
  }
}