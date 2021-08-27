import { ProfileComponent } from './profile/profile.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContainerComponent } from './container/container.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { UsersComponent } from './users/users.component';
import { LoginGuard } from './auth/auth.loginguard';
import { LinksComponent } from './links/links.component';
import { BusinessComponent } from "./business/business.component";
import { RolesComponent } from "./roles/roles.component";
import { TagsComponent } from './tags/tags.component';
import { ReportsComponent } from './reports/reports.component';

const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent,
  },
  {
    path: 'powerBi',
    canActivate: [AuthGuard],
    component: ContainerComponent
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    component: UsersComponent,
    data: {role:['Admin']}
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'linkManager',
    component: LinksComponent,
    canActivate: [AuthGuard],
    data: {role:['Admin']}
  },
  {
    path: 'business',
    component: BusinessComponent,
    canActivate: [AuthGuard],
    data: {role:['Admin']}
  },
  {
    path: 'roles',
    component: RolesComponent,
    canActivate: [AuthGuard],
    data: {role:['Admin']}
  },
  {
    path: 'tags',
    component: TagsComponent,
    canActivate: [AuthGuard],
    data: {role:['Admin']}
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [AuthGuard],
    data: {role:['Admin','Reports']}
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
]

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes,{
    useHash: true
  })]
})
export class AppRoutingModule { }
