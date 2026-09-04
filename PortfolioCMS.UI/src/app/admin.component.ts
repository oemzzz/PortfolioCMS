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
              <h2 class="text-xl font-bold text-white mb-6">Yeni Proje Ekle</h2>
              <form (ngSubmit)="createProject()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" [(ngModel)]="newProject.titleTr" name="titleTr" placeholder="Proje Adı (TR)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="text" [(ngModel)]="newProject.titleEn" name="titleEn" placeholder="Proje Adı (EN)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="text" [(ngModel)]="newProject.category" name="category" placeholder="Kategori (Örn: Full Stack)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="text" [(ngModel)]="newProject.techStack" name="techStack" placeholder="Teknolojiler (Virgülle ayırın)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="text" [(ngModel)]="newProject.githubUrl" name="githubUrl" placeholder="GitHub URL" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400">
                <input type="text" [(ngModel)]="newProject.liveUrl" name="liveUrl" placeholder="Canlı Demo URL" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400">
                <textarea [(ngModel)]="newProject.descriptionTr" name="descriptionTr" placeholder="Açıklama (TR)" rows="3" class="md:col-span-2 bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required></textarea>
                <textarea [(ngModel)]="newProject.descriptionEn" name="descriptionEn" placeholder="Açıklama (EN)" rows="3" class="md:col-span-2 bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required></textarea>
                <button type="submit" class="md:col-span-2 py-3 bg-amber-400 text-gray-950 font-bold rounded-xl hover:bg-amber-300 transition">Projeyi Kaydet</button>
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
                    <button (click)="deleteProject(p.id)" class="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 text-xs font-semibold">Sil</button>
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
                
                <!-- Serbest metin inputu -->
                <input type="text" [(ngModel)]="newSkill.category" name="category" placeholder="Kategori (Örn: Backend, Frontend)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                
                <button type="submit" class="md:col-span-2 py-3 bg-amber-400 text-gray-950 font-bold rounded-xl hover:bg-amber-300 transition">Yetenek Ekle</button>
              </form>
            </div>

            <div class="bg-[#12161f] border border-gray-800/80 rounded-3xl p-6 md:p-8">
              <h2 class="text-xl font-bold text-white mb-6">Mevcut Yetenekler</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @for (s of skills; track s.id) {
                  <div class="flex justify-between items-center bg-[#0a0c10] border border-gray-800/60 p-4 rounded-2xl">
                    
                    <!-- DÜZENLEME MODU KAPALIYKEN -->
                    @if (editingSkill?.id !== s.id) {
                      <div>
                        <h4 class="font-bold text-white">{{ s.name }}</h4>
                        <p class="text-xs text-gray-500 mt-1">{{ s.category }}</p>
                      </div>
                      <div class="flex gap-3">
                        <button (click)="startEditSkill(s)" class="text-amber-400 hover:text-amber-300 text-xs font-semibold">Düzenle</button>
                        <button (click)="deleteSkill(s.id)" class="text-red-400 hover:text-red-300 text-xs font-semibold">Sil</button>
                      </div>
                    } 
                    <!-- DÜZENLEME MODU AÇIKKEN -->
                    @else {
                      <div class="flex flex-wrap gap-2 w-full items-center">
                        <input type="text" [(ngModel)]="editingSkill!.name" class="flex-1 bg-[#12161f] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm" placeholder="Yetenek Adı">
                        <input type="text" [(ngModel)]="editingSkill!.category" class="bg-[#12161f] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm" placeholder="Kategori">
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
              <h2 class="text-xl font-bold text-white mb-6">Eğitim Bilgisi Ekle</h2>
              <form (ngSubmit)="createEducation()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" [(ngModel)]="newEducation.schoolNameTr" name="schoolNameTr" placeholder="Okul / Üniversite (TR)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="text" [(ngModel)]="newEducation.schoolNameEn" name="schoolNameEn" placeholder="Okul / Üniversite (EN)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="text" [(ngModel)]="newEducation.departmentTr" name="departmentTr" placeholder="Bölüm (TR)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="text" [(ngModel)]="newEducation.departmentEn" name="departmentEn" placeholder="Bölüm (EN)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="number" [(ngModel)]="newEducation.startYear" name="startYear" placeholder="Başlangıç Yılı" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="number" [(ngModel)]="newEducation.endYear" name="endYear" placeholder="Bitiş Yılı (Opsiyonel)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400">
                <label class="md:col-span-2 flex items-center gap-3 text-sm text-gray-300">
                  <input type="checkbox" [(ngModel)]="newEducation.isExchange" name="isExchange" class="size-4 accent-amber-400">
                  Erasmus / değişim programı
                </label>
                <button type="submit" class="md:col-span-2 py-3 bg-amber-400 text-gray-950 font-bold rounded-xl hover:bg-amber-300 transition">Eğitim Bilgisi Ekle</button>
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
                    <button (click)="deleteEducation(e.id)" class="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 text-xs font-semibold">Sil</button>
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
              <h2 class="text-xl font-bold text-white mb-6">Akademik Yayın Ekle</h2>
              <form (ngSubmit)="createPaper()" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" [(ngModel)]="newPaper.titleTr" name="titleTr" placeholder="Makale Başlığı (TR)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="text" [(ngModel)]="newPaper.titleEn" name="titleEn" placeholder="Makale Başlığı (EN)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="text" [(ngModel)]="newPaper.journalName" name="journalName" placeholder="Dergi / Konferans Adı" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="text" [(ngModel)]="newPaper.doiNumber" name="doiNumber" placeholder="DOI Numarası" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="text" [(ngModel)]="newPaper.status" name="status" placeholder="Durum (Örn: Yayınlandı / Kabul Edildi)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required>
                <input type="text" [(ngModel)]="newPaper.coAuthors" name="coAuthors" placeholder="Diğer Yazarlar (Opsiyonel)" class="bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400">
                <textarea [(ngModel)]="newPaper.abstractTr" name="abstractTr" placeholder="Özet (TR)" rows="3" class="md:col-span-2 bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required></textarea>
                <textarea [(ngModel)]="newPaper.abstractEn" name="abstractEn" placeholder="Özet (EN)" rows="3" class="md:col-span-2 bg-[#0a0c10] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400" required></textarea>
                <button type="submit" class="md:col-span-2 py-3 bg-amber-400 text-gray-950 font-bold rounded-xl hover:bg-amber-300 transition">Yayın Ekle</button>
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
                    <button (click)="deletePaper(p.id)" class="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 text-xs font-semibold">Sil</button>
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

  newProject: any = { titleTr: '', titleEn: '', descriptionTr: '', descriptionEn: '', category: '', techStack: '', githubUrl: '', liveUrl: '', year: 2026 };
  newSkill: any = { name: '', category: '' }; // Başlangıçta boş, 'Kategori Seçin' varsayılan olarak görünecek
  newEducation: any = { schoolNameTr: '', schoolNameEn: '', departmentTr: '', departmentEn: '', startYear: null, endYear: null, isExchange: false };
  newPaper: any = { titleTr: '', titleEn: '', abstractTr: '', abstractEn: '', doiNumber: '', journalName: '', status: '', coAuthors: '' };

  // Güncelleme mekanizması için state yönetimi
  editingSkill: Skill | null = null;

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

  createProject() {
    this.projectService.createProject(this.newProject).subscribe(() => {
      this.loadData();
      this.newProject = { titleTr: '', titleEn: '', descriptionTr: '', descriptionEn: '', category: '', techStack: '', githubUrl: '', liveUrl: '', year: 2026 };
    });
  }

  deleteProject(id: number) {
    this.projectService.deleteProject(id).subscribe(() => this.loadData());
  }

  createSkill() {
    this.skillService.createSkill(this.newSkill).subscribe(() => {
      this.loadData();
      this.newSkill = { name: '', category: '' };
    });
  }

  // YETENEK DÜZENLEME METOTLARI
  startEditSkill(skill: Skill) {
    this.editingSkill = { ...skill }; // Referansı bozmamak için kopya ile çalışılır
  }

  cancelEditSkill() {
    this.editingSkill = null;
  }

  saveEditSkill() {
    if (!this.editingSkill) return;
    this.skillService.updateSkill(this.editingSkill.id, this.editingSkill).subscribe({
      next: () => {
        this.loadData();
        this.editingSkill = null;
      },
      error: (err) => {
        console.error('Güncelleme hatası:', err);
        alert('Güncelleme başarısız: ' + JSON.stringify(err));
      }
    });
  }

  deleteSkill(id: number) {
    this.skillService.deleteSkill(id).subscribe(() => this.loadData());
  }

  createEducation() {
    this.educationService.createEducation(this.newEducation).subscribe(() => {
      this.loadData();
      this.newEducation = { schoolNameTr: '', schoolNameEn: '', departmentTr: '', departmentEn: '', startYear: null, endYear: null, isExchange: false };
    });
  }

  deleteEducation(id: number) {
    this.educationService.deleteEducation(id).subscribe(() => this.loadData());
  }

  createPaper() {
    this.paperService.createPaper(this.newPaper).subscribe(() => {
      this.loadData();
      this.newPaper = { titleTr: '', titleEn: '', abstractTr: '', abstractEn: '', doiNumber: '', journalName: '', status: '', coAuthors: '' };
    });
  }

  deletePaper(id: number) {
    this.paperService.deletePaper(id).subscribe(() => this.loadData());
  }

  logout() {
    this.authService.logout();
  }
}