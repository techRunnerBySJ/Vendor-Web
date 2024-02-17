import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    data: {title: 'Vendor Login'},
    canActivate: [AuthGuard]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: {title: 'Vendor Login'},
  },
  {
    path: 'verify-otp',
    component: VerifyOtpComponent,
    data: {title: 'Vendor Login'},
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    data: {title: 'Vendor Login'},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
