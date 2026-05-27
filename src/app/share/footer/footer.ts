import {Component, inject} from '@angular/core';
import {DatePipe} from '@angular/common';
import {I18nService} from '../../service/i18n/i18nService';

@Component({
  selector: 'app-footer',
  imports: [
    DatePipe
  ],
  templateUrl: './footer.html',
  styles: [`
    :host {
      display: block;
      margin-top: auto;
    }

    .footer-fotova {
      background-color: rgba(52, 48, 48, 0.95);
      backdrop-filter: blur(6px);
      position: relative;
    }

    .footer-accent {
      height: 2px;
      background: linear-gradient(90deg, transparent, #493112 20%, #6b5232 50%, #493112 80%, transparent);
    }

    .footer-copy {
      color: rgba(255, 255, 255, 0.55);
      letter-spacing: 0.3px;
    }

    .footer-brand {
      color: #f0ece4;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .footer-sep {
      margin: 0 0.5rem;
      color: rgba(255, 255, 255, 0.25);
    }

    .footer-tagline {
      font-size: 0.78rem;
      color: rgba(255, 255, 255, 0.4);
    }

    .footer-social {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      color: rgba(255, 255, 255, 0.6);
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 1rem;
      text-decoration: none;
      transition: all 0.25s ease;
    }

    .footer-social:hover {
      color: #f0ece4;
      background: linear-gradient(135deg, #493112, #4b4133);
      border-color: rgba(240, 236, 228, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 6px 14px rgba(0, 0, 0, 0.35);
    }
  `]
})
export class Footer {
  readonly i18n = inject(I18nService);
  getDate() {
     return new Date();
   }
}
