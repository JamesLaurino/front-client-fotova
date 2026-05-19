import {Component, DestroyRef, inject, signal} from '@angular/core';
import {I18nService} from '../../service/i18n/i18nService';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {rxResource, takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {concatMap, finalize, map} from 'rxjs';
import {CategoryService} from '../../service/category/categoryService';
import {ProductModel} from '../../model/product/product-model';
import {ToasterService} from '../../service/toaster/toasterService';
import {ProductService} from '../../service/interfaces/product-service';
import {ProductApiResponse} from '../../model/product/product-api-response';
import {ProductAdd} from '../../model/product/product-add';
import {FileService} from '../../service/file/fileService';
import {Router} from "@angular/router";
import {PreviewFile} from '../../model/file/preview-file';

@Component({
  selector: 'app-admin-product-create',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './admin-product-create.html',
  styleUrl: './admin-product-create.css'
})
export class AdminProductCreate {

  readonly #categoryService = inject(CategoryService);
  private toasterService = inject(ToasterService);
  readonly #productService = inject(ProductService);
  readonly #fileService = inject(FileService);
  readonly i18n = inject(I18nService);
  readonly #router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  private readonly maxFileSize = 10 * 1024 * 1024;

  productWithoutImage = signal<ProductModel>({
    id:0,
    name:'',
    quantity:0,
    price:0,
    description:'',
    categoryInnerProductDto:{
      id:0,
      name:''
    },
    url:'',
    images:[]
  });

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    quantity: new FormControl(0, [Validators.required, Validators.min(0)]),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    description:new FormControl('', [Validators.required]),
    categoryInnerProductDto: new FormControl<string>('', [Validators.required]),
  });
  categories = rxResource({
    stream: () => this.#categoryService.getAllCategories().pipe(
      map(response => response.data)
    )
  })
  step: 'form' | 'images' = 'form';
  isSubmitting = signal(false);
  fileBoxes: FileBox[] = [{ file: undefined, uploading: false, isDragging: false }];
  previewFiles = signal<PreviewFile[]>([]);

  get name() { return this.form.get('name') as FormControl; }
  get quantity() { return this.form.get('quantity') as FormControl; }
  get description() {return this.form.get('description') as FormControl; }
  get price() { return this.form.get('price') as FormControl; }
  get category() { return this.form.get('categoryInnerProductDto') as FormControl; }


  addFileBox() {
    this.fileBoxes.push({ file: undefined, uploading: false, isDragging: false });
  }

  removeFileBox(index: number) {
    const previewToRemove = this.previewFiles().find(p => p.sourceIndex === index);
    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove.url);
      this.previewFiles.update(files => files.filter(p => p.sourceIndex !== index));
      this.fileBoxes[index].file = undefined;
    }

    this.fileBoxes.splice(index, 1);
    if (this.fileBoxes.length === 0) {
      this.fileBoxes.push({ file: undefined, uploading: false, isDragging: false });
    }

    this.previewFiles.update(files =>
      files.map(p => p.sourceIndex > index ? { ...p, sourceIndex: p.sourceIndex - 1 } : p)
    );
  }

  removePreview(previewToRemove: PreviewFile) {
    URL.revokeObjectURL(previewToRemove.url);
    this.previewFiles.update(files => files.filter(p => p.url !== previewToRemove.url));
    const box = this.fileBoxes[previewToRemove.sourceIndex];
    if (box) {
      box.file = undefined;
    }
  }

  private addPreview(file: File, index: number) {
    const existingPreview = this.previewFiles().find(p => p.sourceIndex === index);
    if (existingPreview) {
      URL.revokeObjectURL(existingPreview.url);
    }

    const url = URL.createObjectURL(file);
    this.previewFiles.update(files => {
      const otherFiles = files.filter(p => p.sourceIndex !== index);
      return [...otherFiles, { file, url, sourceIndex: index }];
    });
  }

  finish() {
    this.toasterService.show({
      toastTitle: this.i18n.getTranslation("SUCCESS"),
      toastTime: this.i18n.getTranslation("JUST_NOW"),
      toastImageUrl: '/fotova/check.jpg',
      toastMessage: this.i18n.getTranslation("PRODUCT_CREATED_WITH_IMAGES_SUCCESS"),
    });
    this.#router.navigate(['/admin'], { queryParams: { active: 'products' } });
  }

  goToImages() {
    if (!this.form.valid) return;

    const categoryId = Number(this.getCategoryAndId());
    const productAdd: ProductAdd = {
      name: String(this.name.value),
      price: Number(this.price.value),
      quantity: Number(this.quantity.value),
      description: String(this.description.value),
      url: '',
    };

    this.isSubmitting.set(true);
    this.#productService.addProductWithCategory(productAdd, categoryId).pipe(
      finalize(() => this.isSubmitting.set(false)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (response: ProductApiResponse) => {
        this.productWithoutImage.set({ ...response.data });
        this.step = 'images';
      },
      error: () => {
        this.toasterService.show({
          toastTitle: this.i18n.getTranslation("ERROR"),
          toastTime: this.i18n.getTranslation("JUST_NOW"),
          toastImageUrl: '/fotova/error.png',
          toastMessage: this.i18n.getTranslation("PRODUCT_CREATION_FAILED")
        });
      }
    });
  }

  onDragOver(event: DragEvent, index: number) {
    event.preventDefault();
    this.fileBoxes[index].isDragging = true;
  }

  onDragLeave(event: DragEvent, index: number) {
    event.preventDefault();
    this.fileBoxes[index].isDragging = false;
  }

  onFileDrop(event: DragEvent, index: number) {
    event.preventDefault();
    if (event.dataTransfer?.files?.length) {
      const file = event.dataTransfer.files[0];
      if (!this.validateFile(file)) {
        this.fileBoxes[index].isDragging = false;
        return;
      }
      this.fileBoxes[index].file = file;
      this.addPreview(file, index);
    }
    this.fileBoxes[index].isDragging = false;
  }

  onFileSelect(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      if (!this.validateFile(file)) return;
      this.fileBoxes[index].file = file;
      this.addPreview(file, index);
    }
  }

  private validateFile(file: File): boolean {
    if (!this.allowedTypes.includes(file.type)) {
      this.toasterService.show({
        toastTitle: this.i18n.getTranslation('ERROR'),
        toastTime: this.i18n.getTranslation('JUST_NOW'),
        toastImageUrl: '/fotova/error.png',
        toastMessage: this.i18n.getTranslation('INVALID_FILE_TYPE')
      });
      return false;
    }
    if (file.size > this.maxFileSize) {
      this.toasterService.show({
        toastTitle: this.i18n.getTranslation('ERROR'),
        toastTime: this.i18n.getTranslation('JUST_NOW'),
        toastImageUrl: '/fotova/error.png',
        toastMessage: this.i18n.getTranslation('FILE_TOO_LARGE')
      });
      return false;
    }
    return true;
  }

  backToPanel(){
    this.#router.navigate(['/admin'],{queryParams:{active:'products'}});
  }

  uploadFile(index: number) {
    const box = this.fileBoxes[index];
    if (!box.file) return;

    const fileName = box.file.name;
    const productId = this.productWithoutImage().id;
    const formData = new FormData();
    formData.append('file', box.file, fileName);
    box.uploading = true;

    this.#fileService.uploadFile(formData).pipe(
      concatMap(() => {
        if (index === 0) {
          return this.#productService.updateProduct({ ...this.productWithoutImage(), url: fileName });
        } else {
          return this.#fileService.linkImageToProduct(productId, fileName);
        }
      }),
      finalize(() => {
        box.uploading = false;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        if (index === 0) {
          this.productWithoutImage.update(p => ({ ...p, url: fileName }));
        }
        this.toasterService.show({
          toastTitle: this.i18n.getTranslation("SUCCESS"),
          toastTime: this.i18n.getTranslation("JUST_NOW"),
          toastImageUrl: '/fotova/check.jpg',
          toastMessage: this.i18n.getTranslation("PRODUCT_IMAGE_UPDATED_SUCCESS")
        });
        this.removeFileBox(index);
      },
      error: () => {
        this.toasterService.show({
          toastTitle: this.i18n.getTranslation("ERROR"),
          toastTime: this.i18n.getTranslation("JUST_NOW"),
          toastImageUrl: '/fotova/error.png',
          toastMessage: this.i18n.getTranslation("UNKNOWN_ERROR")
        });
      }
    });
  }

  getCategoryAndId(): number | null {
      for(let category of this.categories.value()!) {
        if(category.name === String(this.form.value.categoryInnerProductDto)) {
          return Number(category.id)
        }
      }
    return null;
  }
}
