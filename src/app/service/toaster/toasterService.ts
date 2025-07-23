import {ToasterModel} from '../../model/toaster/toaster-model';
import {Injectable, signal, WritableSignal} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToasterService {
  message: WritableSignal<ToasterModel | null> = signal(null);

  show(toast: ToasterModel) {
    this.message.set(toast);
  }

  clear() {
    this.message.set(null);
  }
}
