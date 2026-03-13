import { Component, inject } from '@angular/core';
import { AuthService } from '../../service/authservvice';
import { CartService } from '../../service/cart-service';
import { ProductService } from '../../service/product-service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  isCollapsed = true;
  cartCount = 0;
  private authService = inject(AuthService);
  isAuthenticated = toSignal(this.authService.isAuthenticated(), { initialValue: false });

  constructor(
    private cartService: CartService,
    public productService: ProductService
  ) { }
  ngOnInit() {
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
    this.cartCount = this.cartService.getCartCount();
  }

  toggleNavbar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this.authService.logout();
  }
}
