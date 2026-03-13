import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { Product, ProductService } from '../service/product-service';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit{
  products: Product[] = [];
  loading = true;

  constructor(public productService: ProductService,private cdr:ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts(12).subscribe({
      next: res => {
        this.products = res.products;
        this.loading = false;
        this.cdr.detectChanges();
        console.log(res);
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
        console.log(err);
      }
    });
  }
}
