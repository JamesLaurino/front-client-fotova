import {Component, computed, effect, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {I18nService} from '../../service/i18n/i18nService';
import {rxResource} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {LabelService} from '../../service/label/label-service';
import {ToasterService} from '../../service/toaster/toasterService';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-admin-product-label',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './admin-product-label.html',
  styleUrls: ['admin-product-label.css']
})
export class AdminProductLabel {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly labelService = inject(LabelService);
  private readonly toaster = inject(ToasterService);
  readonly #router = inject(Router);
  protected readonly i18n = inject(I18nService);

  private readonly productId = Number(this.route.snapshot.paramMap.get('id'));

  // UI state
  readonly isEditMode = signal(false);
  readonly isSaving = signal(false);

  // Resource
  readonly labelResource = rxResource({
    stream: () => this.labelService
      .getLabelByProductId(this.productId)
      .pipe(map(r => r.data))
  });

  readonly label = computed(() => this.labelResource.value());
  readonly isLoading = computed(() => this.labelResource.isLoading());

  // Form
  readonly form = this.fb.nonNullable.group({
    id: 0,
    productId: 0,
    titleEn: ['', Validators.required],
    titleFr: ['', Validators.required],
    titleRu: ['', Validators.required],
    descriptionEn: [''],
    descriptionFr: [''],
    descriptionRu: ['']
  });

  constructor() {
    // Sync form when data arrives
    effect(() => {
      const data = this.label();
      if (!data) return;

      this.form.patchValue(data);
    });
  }

  enableEdit() {
    this.isEditMode.set(true);
  }

  cancelEdit() {
    this.isEditMode.set(false);
    this.form.patchValue(this.label()!);
  }

  submit() {
    if (this.form.invalid) return;

    this.isSaving.set(true);

    this.labelService.updateLabel(this.form.getRawValue()).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.isEditMode.set(false);
        this.labelResource.reload();

        this.toaster.show({
          toastTitle: this.i18n.getTranslation('SUCCESS'),
          toastTime: this.i18n.getTranslation('JUST_NOW'),
          toastImageUrl: '/fotova/check.jpg',
          toastMessage: this.i18n.getTranslation('LABELS_UPDATE_SUCCESS')
        });
      },
      error: () => {
        this.isSaving.set(false);

        this.toaster.show({
          toastTitle: this.i18n.getTranslation('ERROR'),
          toastTime: this.i18n.getTranslation('JUST_NOW'),
          toastImageUrl: '/fotova/error.png',
          toastMessage: this.i18n.getTranslation('LABELS_UPDATE_FAILED')
        });
      }
    });
  }

  backToLabel() {
    this.#router.navigate(['/admin'],{queryParams:{active:'products'}});
  }
}
