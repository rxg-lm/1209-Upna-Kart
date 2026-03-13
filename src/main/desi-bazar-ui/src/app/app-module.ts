import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Login } from './login/login';
import { ReactiveFormsModule } from '@angular/forms';
import { Signup } from './signup/signup';
import { Products } from './products/products';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './service/interceptor/auth-interceptor';
import { Profile } from './profile/profile';

@NgModule({
  declarations: [
    App,
    Navbar,
    Footer,
    Login,
    Signup,
    Products,
    Profile
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor]))
  ],
  bootstrap: [App]
})
export class AppModule { }

