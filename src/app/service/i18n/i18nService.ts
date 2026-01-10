import { Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class I18nService {

  readonly #API_URL = environment.apiUrl;

  private readonly translations = signal<Record<string, string>>({});

  public readonly currentLanguage = signal<string>('fr');

  constructor(private http: HttpClient) {
    effect(() => {
      this.loadTranslations(this.currentLanguage());
    }, { allowSignalWrites: true });
  }

  getTranslation(key: string): string {
    return this.translations()[key] || key;
  }

  private loadTranslations(lang: string): void {
    const url = `${this.#API_URL}/i18n/${lang}`;
    this.http.get<Record<string, string>>(url).subscribe({
      next: (data) => this.translations.set(data),
      error: (err) => {
        console.error(`Erreur lors du chargement des traductions pour ${lang}:`, err);
        this.translations.set({});
      }
    });
  }

  getLanguage(): string {
    return this.currentLanguage();
  }

  setLanguage(lang: string): void {
    this.currentLanguage.set(lang);
  }
}
