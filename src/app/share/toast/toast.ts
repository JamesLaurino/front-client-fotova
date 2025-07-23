import {Component, effect, ElementRef, inject, ViewChild} from '@angular/core';
import {ToasterService} from '../../service/toaster/toasterService';

declare var bootstrap: any;

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrls:[]
})
export class Toast {
  toaster = inject(ToasterService);

  @ViewChild('toastElement') toastElement!: ElementRef;

  constructor() {
    effect(() => {
      const toast = this.toaster.message();
      if (toast) {
        queueMicrotask(() => {
          const toastInstance = new bootstrap.Toast(this.toastElement.nativeElement);
          toastInstance.show();
        });
      }
    });
  }
}
