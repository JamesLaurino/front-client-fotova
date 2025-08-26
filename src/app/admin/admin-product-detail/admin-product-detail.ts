import {Component, computed, effect, inject} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../../service/interfaces/product-service";
import {I18nService} from "../../service/i18n/i18nService";
import {rxResource} from "@angular/core/rxjs-interop";
import {finalize, map, switchMap} from "rxjs";
import {ProductModel} from "../../model/product/product-model";
import {ProductUpdate} from "../../model/product/product-update";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ToasterService} from "../../service/toaster/toasterService";
import {FileService} from "../../service/file/fileService";
import urlHelper from '../../helper/url-helper';
import imageHelper from '../../helper/image-helper';

@Component({
  selector: 'app-admin-product-detail',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-product-detail.html',
  styleUrl: './admin-product-detail.css'
})
export class AdminProductDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly toasterService = inject(ToasterService);
  private readonly fileService = inject(FileService);
  private readonly router = inject(Router);
  readonly i18n = inject(I18nService);

  private productId = this.route.snapshot.paramMap.get('id');
  protected readonly urlHelper = urlHelper;
  protected readonly String = String;


  productResource = rxResource({
    stream: () => this.productService.getProductById(Number(this.productId)).pipe(
      map(response => response.data)
    )
  });

  product = computed(() => this.productResource.value());

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    quantity: new FormControl(0, [Validators.required]),
    price: new FormControl(0, [Validators.required]),
  });

  step: 'form' | 'images' = 'form';
  fileBoxes: FileBox[] = [{ file: undefined, uploading: false, isDragging: false }];

  constructor() {
    effect(() => {
      const p = this.product();
      if (p) {
        this.form.patchValue(p);

      }
    });
  }

  get name() { return this.form.get('name') as FormControl; }
  get quantity() { return this.form.get('quantity') as FormControl; }
  get price() { return this.form.get('price') as FormControl; }

  updateProduct() {
    if (this.form.invalid || !this.product()) return;

    const currentProduct = this.product()!;
    const formValue = this.form.value;

    const productUpdate: ProductUpdate = {
      id: currentProduct.id,
      name: formValue.name ?? currentProduct.name,
      price: formValue.price ?? currentProduct.price,
      quantity: formValue.quantity ?? currentProduct.quantity,
      url: currentProduct.url,
      categoryInnerProductDto: currentProduct.categoryInnerProductDto
    };

    this.productService.updateProduct(productUpdate).subscribe({
      next: () => {
        this.toasterService.show({
          toastTitle: 'Succès',
          toastTime: 'Just now',
          toastImageUrl: '/fotova/check.jpg',
          toastMessage: 'Produit mis à jour avec succès.'
        });
        this.step = 'images';
      },
      error: (err) => {
        this.toasterService.show({
          toastTitle: 'Échec',
          toastTime: 'Just now',
          toastImageUrl: '/fotova/error.png',
          toastMessage: `Erreur: ${err.error?.errorList?.[0] || 'inconnue'}`
        });
      }
    });
  }

  addFileBox() {
    this.fileBoxes.push({ file: undefined, uploading: false, isDragging: false });
  }

  removeFileBox(index: number) {
    this.fileBoxes.splice(index, 1);
    if (this.fileBoxes.length === 0) {
      this.fileBoxes.push({ file: undefined, uploading: false, isDragging: false });
    }
  }

  onFileDrop(event: DragEvent, index: number) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.fileBoxes[index].file = files[0];
      this.fileBoxes[index].isDragging = false;
    }
  }

  onFileSelect(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fileBoxes[index].file = input.files[0];
    }
  }

  uploadFile(index: number) {
    const box = this.fileBoxes[index];
    const currentProduct = this.product();
    if (!box.file || !currentProduct) return;

    box.uploading = true;

    const formData = new FormData();
    formData.append('file', box.file, box.file.name);

    this.fileService.uploadFile(formData).pipe(
      switchMap(() => {
        if (index === 0) {
          const updatedProduct: ProductModel = { ...currentProduct, url: box.file!.name };
          return this.productService.updateProduct(updatedProduct);
        } else {
          return this.fileService.linkImageToProduct(currentProduct.id, box.file!.name);
        }
      }),
      finalize(() => {
        box.uploading = false;
      })
    ).subscribe({
      next: () => {
        this.toasterService.show({
          toastTitle: 'Succès',
          toastTime: 'Just now',
          toastImageUrl: '/fotova/check.jpg',
          toastMessage: 'Image téléversée avec succès.'
        });
        this.productResource.reload();
        this.removeFileBox(index);
      },
      error: (err) => {
        this.toasterService.show({
          toastTitle: 'Échec',
          toastTime: 'Just now',
          toastImageUrl: '/fotova/error.png',
          toastMessage: `Erreur: ${err.error?.errorList?.[0] || 'inconnue'}`
        });
      }
    });
  }

  finish() {
    this.router.navigate(['/admin']);
  }

  onDragOver(event: DragEvent, index: number) {
    event.preventDefault();
    this.fileBoxes[index].isDragging = true;
  }

  onDragLeave(event: DragEvent, index: number) {
    event.preventDefault();
    this.fileBoxes[index].isDragging = false;
  }

  deleteImageMain() {
    let currentProduct = this.product()!;
    let productUpdateImages: ProductUpdate = {
      id: currentProduct.id,
      name: currentProduct.name,
      price: currentProduct.price,
      quantity: currentProduct.quantity,
      url: "",
      categoryInnerProductDto: currentProduct.categoryInnerProductDto
    };

    this.productService.updateProduct(productUpdateImages).subscribe({
      next: () => {
        this.toasterService.show({
          toastTitle: 'Succès',
          toastTime: 'Just now',
          toastImageUrl: '/fotova/check.jpg',
          toastMessage: 'Image du produit mise à jour avec succès.'
        });
        this.productResource.reload();
      },
      error: (err) => {
        this.toasterService.show({
          toastTitle: 'Échec',
          toastTime: 'Just now',
          toastImageUrl: '/fotova/error.png',
          toastMessage: `Erreur: ${err.error?.errorList?.[0] || 'inconnue'}`
        });
      }
    });
  }

  deleteImageGallery(productId:number,imageName:string) {
    console.log(productId,imageName)
    this.fileService.removeImageGallery(imageName, productId)
      .subscribe({
        next:() => {
          this.toasterService.show({
            toastTitle: 'Succès',
            toastTime: 'Just now',
            toastImageUrl: '/fotova/check.jpg',
            toastMessage: 'Image du produit mise à jour avec succès.'
          });
          this.productResource.reload();
        },
        error: (err) => {
          this.toasterService.show({
            toastTitle: 'Échec',
            toastTime: 'Just now',
            toastImageUrl: '/fotova/error.png',
            toastMessage: `Erreur: ${err.error?.errorList?.[0] || 'inconnue'}`
          });
        }
      })
  }
  protected readonly Number = Number;
  protected readonly imageHelper = imageHelper;
}
