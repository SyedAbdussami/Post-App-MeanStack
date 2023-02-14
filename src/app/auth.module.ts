import { NgModule } from "@angular/core";
import { LoginComponent } from "./components/login/login.component";
import { SignupComponent } from "./components/signup/signup.component";
import { FormsModule } from "@angular/forms";
import { AngularMaterialModule } from "./angular-material.module";
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [FormsModule, AngularMaterialModule,CommonModule]
})
export class AuthModule {}
