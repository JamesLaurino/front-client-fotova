import {Component, inject, signal} from '@angular/core';
import {I18nService} from '../../service/i18n/i18nService';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {rxResource} from '@angular/core/rxjs-interop';
import {concatMap, finalize, map, tap} from 'rxjs';
import {CategoryService} from '../../service/category/categoryService';
import {ProductModel} from '../../model/product/product-model';
import {ToasterService} from '../../service/toaster/toasterService';
import {ProductService} from '../../service/interfaces/product-service';
import {ProductApiResponse} from '../../model/product/product-api-response';
import {ProductAdd} from '../../model/product/product-add';
import {FileService} from '../../service/file/fileService';
import {Router} from "@angular/router";


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

  productWithoutImage = signal<ProductModel>({
    id:0,
    name:'',
    quantity:0,
    price:0,
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
    categoryInnerProductDto: new FormControl<string[]>([], [Validators.required]),
  });
  categories = rxResource({
    stream: () => {
      return this.#categoryService.getAllCategories()
        .pipe(
          map(response => response.data),
          tap(product => console.log(product))
        )
    }
  })
  step: 'form' | 'images' = 'form';
  fileBoxes: FileBox[] = [{ file: undefined, uploading: false, isDragging: false }];

  get name() { return this.form.get('name') as FormControl; }
  get quantity() { return this.form.get('quantity') as FormControl; }
  get price() { return this.form.get('price') as FormControl; }
  get category() { return this.form.get('categoryInnerProductDto') as FormControl; }


  addFileBox() {
    this.fileBoxes.push({ file: undefined, uploading: false, isDragging: false });
  }

  removeFileBox(index: number) {
    this.fileBoxes.splice(index, 1);
    if (this.fileBoxes.length === 0) {
      this.fileBoxes.push({ file: undefined, uploading: false, isDragging: false });
    }
  }

  finish() {
    if(confirm('Attention les images non uploadées seront perdues. Voulez-vous continuer ?')) {
      this.toasterService.show({
        toastTitle: 'Succès',
        toastTime: 'Just now',
        toastImageUrl: '/fotova/check.jpg',
        toastMessage: 'Produit créé et images téléversées avec succès.'
      });
      this.#router.navigate(['/admin']);
    }
  }

  goToImages() {
    if (this.form.valid) {
      this.step = 'images';
      let categoryId = Number(this.getCategoryAndId());
      let productAdd:ProductAdd = {
        name: String(this.name.value),
        price: Number(this.price.value),
        quantity: Number(this.quantity.value),
        url: '',
      }
      this.#productService.addProductWithCategory(productAdd, categoryId).subscribe({
        next:(response:ProductApiResponse) => {
          this.productWithoutImage.update((n) => {
            n.id = response.data.id;
            n.name = response.data.name;
            n.quantity = response.data.quantity;
            n.price = response.data.price;
            n.categoryInnerProductDto.id = response.data.categoryInnerProductDto.id;
            n.categoryInnerProductDto.name = response.data.categoryInnerProductDto.name;
            n.url = response.data.url;
            n.images = response.data.images;
            return n;
          })
        },
        error: () => {
          this.toasterService.show({
            toastTitle: 'Erreur',
            toastTime: 'Just now',
            toastImageUrl: '/fotova/error.png',
            toastMessage: "Produit et images n'ont pas pu être téléversée"
          });
        }
      })

    }
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
      this.fileBoxes[index].file = event.dataTransfer.files[0];
    }
    this.fileBoxes[index].isDragging = false;
  }

  onFileSelect(event: any, index: number) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileBoxes[index].file = file;
    }
  }

  uploadFile(index: number) {
    const box = this.fileBoxes[index];
    if (!box.file) return;

    const formData = new FormData();
    formData.append('file', box.file, box.file.name);

    if(index == 0) {
      this.productWithoutImage.update((product) => {
        product.url = String(box.file?.name);
        return product;
      })
    } else {
      this.productWithoutImage.update((product) => {
        product.images = [];
        product.images = [(String(box.file?.name))];
        return product;
      })
    }
    box.uploading = true;

    this.#fileService.uploadFile(formData).pipe(
      concatMap(() => {
        if (index === 0) {
          return this.#productService.updateProduct(this.productWithoutImage());
        } else {
          return this.#fileService.linkImageToProduct(
            this.productWithoutImage().id,
            String(box.file!.name)
          );
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
          toastMessage: 'Image uploadée et produit mis à jour.'
        });
        this.removeFileBox(index);
      },
      error: (error) => {
        console.error('Erreur détaillée reçue dans la chaîne RxJS :', error);
        this.toasterService.show({
          toastTitle: 'Échec',
          toastTime: 'Just now',
          toastImageUrl: '/fotova/error.png',
          toastMessage: `Erreur : ${error.error?.errorList?.[0] || 'Une erreur inconnue est survenue.'}`
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
