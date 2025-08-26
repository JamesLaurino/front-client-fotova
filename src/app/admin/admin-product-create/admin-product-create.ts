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
  fileBoxes: FileBox[] = [{ file: undefined, uploading: false }];

  get name() { return this.form.get('name') as FormControl; }
  get quantity() { return this.form.get('quantity') as FormControl; }
  get price() { return this.form.get('price') as FormControl; }
  get category() { return this.form.get('categoryInnerProductDto') as FormControl; }


  addFileBox() {
    this.fileBoxes.push({ file: undefined, uploading: false });
  }

  removeFileBox(index: number) {
    this.fileBoxes.splice(index, 1);
    if (this.fileBoxes.length === 0) {
      this.fileBoxes.push({ file: undefined, uploading: false });
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
        error: (error) => {
          console.log("Une erreur est survenue")
        }
      })

    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  onFileDrop(event: DragEvent, index: number) {
    event.preventDefault();
    if (event.dataTransfer?.files?.length) {
      this.fileBoxes[index].file = event.dataTransfer.files[0];
    }
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

    //this.removeFileBox(index);
    //this.#fileService.uploadFile(formData).subscribe({
    //   next: () => {
    //     this.toasterService.show({
    //       toastTitle: 'Succès',
    //       toastTime: 'Just now',
    //       toastImageUrl: '/fotova/check.jpg',
    //       toastMessage: 'Mise à jour de la catégorie effectuée avec succès.'
    //     });
    //     box.uploading = false;
    //   },
    //   error:(error) => {
    //     this.toasterService.show({
    //       toastTitle: 'Echec',
    //       toastTime: 'Just now',
    //       toastImageUrl: '/fotova/error.png',
    //       toastMessage: "Erreur lors de l'upload de l'image : " + error.error.errorList[0]
    //     });
    //     box.uploading = false;
    //   }
    // })

    // if(index == 0) {
    //   this.#productService.updateProduct(this.productWithoutImage())
    //     .subscribe({
    //       next:() => {
    //         this.toasterService.show({
    //           toastTitle: 'Succès',
    //           toastTime: 'Just now',
    //           toastImageUrl: '/fotova/check.jpg',
    //           toastMessage: 'Mise à jour du produit effectuée avec succès.'
    //         });
    //       },
    //       error: (error) => {
    //         this.toasterService.show({
    //           toastTitle: 'Echec',
    //           toastTime: 'Just now',
    //           toastImageUrl: '/fotova/error.png',
    //           toastMessage: "Erreur lors de la mise à jours du produit : " + error.error.errorList[0]
    //         });
    //       }
    //     })
    // } else {
    //   this.#fileService.linkImageToProduct(
    //     this.productWithoutImage().categoryInnerProductDto.id, (String(box.file.name)))
    //     .subscribe({
    //       next:() => {
    //         this.toasterService.show({
    //           toastTitle: 'Succès',
    //           toastTime: 'Just now',
    //           toastImageUrl: '/fotova/check.jpg',
    //           toastMessage: 'Mise à jour de la catégorie effectuée avec succès.'
    //         });
    //       },
    //       error: (error) => {
    //         this.toasterService.show({
    //           toastTitle: 'Echec',
    //           toastTime: 'Just now',
    //           toastImageUrl: '/fotova/error.png',
    //           toastMessage: "Erreur lors de l'upload de l'image : " + error.error.errorList[0]
    //         });
    //       }
    //     })
    // }


    /* GEMINI */
    this.#fileService.uploadFile(formData).pipe(
      // concatMap attend la fin de uploadFile avant de continuer.
      concatMap(() => {
        console.log("Donnée envoyée : ");
        console.log(this.productWithoutImage())
        if (index === 0) {
          console.log("INDEX : " + index)
          return this.#productService.updateProduct(this.productWithoutImage());
        } else {
          console.log("INDEX : " + index)
          return this.#fileService.linkImageToProduct(
            this.productWithoutImage().id,
            String(box.file!.name)
          );
        }
      }),
      finalize(() => {
        box.uploading = false;
        this.removeFileBox(index);
      })
    ).subscribe({
      next: () => {
        this.toasterService.show({
          toastTitle: 'Succès',
          toastTime: 'Just now',
          toastImageUrl: '/fotova/check.jpg',
          toastMessage: 'Mise à jour du produit effectuée avec succès.'
        });
      },
      error: (error) => {
        console.error('Erreur détaillée reçue dans la chaîne RxJS :', error);
        this.toasterService.show({
          toastTitle: 'Échec',
          toastTime: 'Just now',
          toastImageUrl: '/fotova/error.png',
          // Utilisation d'un "optional chaining" pour éviter une erreur si la structure de l'erreur change.
          toastMessage: `Erreur : ${error.error?.errorList?.[0] || 'Une erreur inconnue est survenue.'}`
        });
      }
    });

    //this.removeFileBox(index);
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
