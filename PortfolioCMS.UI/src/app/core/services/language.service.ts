import { Injectable, signal } from '@angular/core';

export type Language = 'tr' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly language = signal<Language>('tr');

  toggle(): void {
    this.language.update(current => current === 'tr' ? 'en' : 'tr');
  }
}
