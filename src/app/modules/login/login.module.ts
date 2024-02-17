import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FormHeaderComponent } from './form-header/form-header.component';
import { FooterComponent } from './footer/footer.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    LoginComponent,
    ResetPasswordComponent,
    VerifyOtpComponent,
    ForgotPasswordComponent,
    FormHeaderComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    SharedModule,
    NgOtpInputModule,
  ],
})
export class LoginModule {}
