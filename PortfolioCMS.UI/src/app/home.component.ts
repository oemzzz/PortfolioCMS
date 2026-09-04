import { ChangeDetectorRef, Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { RevealDirective } from './core/directives/reveal.directive';
import { AcademicPaper, AcademicPaperService } from './core/services/academic-paper';
import { Education, EducationService } from './core/services/education';
import { LanguageService } from './core/services/language.service';
import { Project, ProjectService } from './core/services/project';
import { Skill, SkillService } from './core/services/skill';

interface SkillGroup {
  category: string;
  skills: Skill[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  skills: Skill[] = [];
  educations: Education[] = [];
  papers: AcademicPaper[] = [];
  private readonly languageService = inject(LanguageService);
  language = this.languageService.language;
  emailCopied = false;
  scrollOffset = 0;
  typedRole = '';
  isLoading = true;
  private typewriterTimer?: ReturnType<typeof setTimeout>;
  private typewriterIndex = 0;
  private readonly roles = ['Computer Engineer', 'Full Stack .NET Developer', 'ML Researcher'];

  constructor(
    private projectService: ProjectService,
    private skillService: SkillService,
    private educationService: EducationService,
    private paperService: AcademicPaperService,
    private cdr: ChangeDetectorRef
  ) {}

  get skillsByCategory(): SkillGroup[] {
    const groups = new Map<string, Skill[]>();
    for (const skill of this.skills) {
      if (!groups.has(skill.category)) groups.set(skill.category, []);
      groups.get(skill.category)!.push(skill);
    }
    return Array.from(groups.entries()).map(([category, skills]) => ({ category, skills }));
  }

  ngOnInit(): void {
    this.startTypewriter();
    this.projectService.getProjects().subscribe({
      next: data => {
        this.projects = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
    this.skillService.getSkills().subscribe(data => {
      this.skills = data;
      this.cdr.detectChanges();
    });
    this.educationService.getEducations().subscribe(data => {
      this.educations = data;
      this.cdr.detectChanges();
    });
    this.paperService.getPapers().subscribe(data => {
      this.papers = data;
      this.cdr.detectChanges();
    });
  }

  toggleLanguage(): void {
    this.languageService.toggle();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrollOffset = Math.min(window.scrollY * 0.22, 320);
  }

  async copyEmail(): Promise<void> {
    await navigator.clipboard.writeText('atakan.ozcelebi.dev@gmail.com');
    this.emailCopied = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.emailCopied = false;
      this.cdr.detectChanges();
    }, 1800);
  }

  private startTypewriter(): void {
    const role = this.roles[this.typewriterIndex % this.roles.length];
    let characterIndex = 0;
    const typeNext = (): void => {
      this.typedRole = role.slice(0, characterIndex++);
      this.cdr.detectChanges();
      if (characterIndex <= role.length) {
        this.typewriterTimer = setTimeout(typeNext, 75);
      } else {
        this.typewriterTimer = setTimeout(() => {
          this.typewriterIndex++;
          this.startTypewriter();
        }, 1800);
      }
    };
    typeNext();
  }

  ngOnDestroy(): void {
    if (this.typewriterTimer) clearTimeout(this.typewriterTimer);
  }
}