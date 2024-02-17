import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './shared/components/change-password/change-password.component';
import { Page404Component } from './shared/components/page404/page404.component';
import { ServerErrorPageComponent } from './shared/components/server-error-page/server-error-page.component';
import { AuthGuard } from './shared/guards/auth.guard';
const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'my-orders',
  //   pathMatch: 'full',
  //   canActivate:[AuthGuard]
  // },
  // {
  //   path: '',
  //   redirectTo: 'grocery-orders',
  //   pathMatch: 'full',
  //   canActivate:[AuthGuard]
  // },
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./modules/home/home.module').then((m) => m.HomeModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    data: { title: 'Change Password' },
    canActivate: [AuthGuard],

  },
  {
    path: 'serverError',
    component: ServerErrorPageComponent,
    data: {title: 'Internal Server Error'}
  },
  //Wild Card Route for 404 request
  { 
    path: '**', 
    pathMatch: 'full',
   component: Page404Component,
   data: {title: 'Invalid Path'}
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
