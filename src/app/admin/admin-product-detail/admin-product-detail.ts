import {Component, computed, inject, signal} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ProductService} from "../../service/interfaces/product-service";
import {I18nService} from "../../service/i18n/i18nService";
import {rxResource} from "@angular/core/rxjs-interop";
import {map} from "rxjs";
import {ReactiveFormsModule} from "@angular/forms";
import urlHelper from '../../helper/url-helper';

@Component({
  selector: 'app-admin-product-detail',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-product-detail.html',
  styleUrl: './admin-product-detail.css'
})
export class AdminProductDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  readonly i18n = inject(I18nService);

  private productId = this.route.snapshot.paramMap.get('id');
  protected readonly urlHelper = urlHelper;
  protected readonly String = String;

  selectedImage = signal<string | null>(null);

  openImage(imageUrl: string) {
    this.selectedImage.set(imageUrl);
  }

  closeImage() {
    this.selectedImage.set(null);
  }

  productResource = rxResource({
    stream: () => this.productService.getProductById(Number(this.productId)).pipe(
      map(response => response.data)
    )
  });

  product = computed(() => this.productResource.value());

  backToPanel() {
    this.router.navigate(['/admin'], { queryParams: { active: 'products' } });
  }
}
