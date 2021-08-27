import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { ModalModule, TooltipModule } from 'ngx-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgxPaginationModule } from "ngx-pagination";
import { BlockUIModule } from 'ng-block-ui';
import { AutocompleteModule } from 'ng2-input-autocomplete';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

import { AppComponent } from './app.component';
import { DashboardComponent, BackgroundDirective } from './dashboard/dashboard.component';
import { ContainerComponent } from './container/container.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UsersComponent } from './users/users.component';
import { LinksComponent } from './links/links.component';
import { BusinessComponent } from './business/business.component';

import { AuthGuard } from './auth/auth.guard';
import { LoginGuard } from "./auth/auth.loginguard";
import { AuthInterceptor } from './auth/auth.interceptor';

import { RegionService } from './services/region.service';
import { UserService } from './shared/user.service';
import { LinkService } from "./services/link.service";
import { NavbarService } from './navbar.service';
import { BusinessCatalogService } from "./services/business-catalog.service";
import { RegionCatalogService } from "./services/region-catalog.service";
import { RoleService } from "./services/roles.service";
import { InactivityService } from "./services/inactivity.service";
import { ReportService } from './services/report.service';

import { SearchFilterPipe } from "./pipes/search.pipe";
import { RolesComponent } from './roles/roles.component';
import { FooterComponent } from './footer/footer.component';
import { TagsComponent } from './tags/tags.component';
import { TagService } from './services/tags.service';
import { ProfileComponent } from './profile/profile.component';
import { CustomSessionTimeoutComponent } from './custom-session-timeout/custom-session-timeout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ReportsComponent } from './reports/reports.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ContainerComponent,
    LoginComponent,
    NavbarComponent,
    FooterComponent,
    UsersComponent,
    LinksComponent,
    SearchFilterPipe,
    BusinessComponent,
    RolesComponent,
    TagsComponent,
    ProfileComponent,
    BackgroundDirective,
    CustomSessionTimeoutComponent,
    SidebarComponent,
    ReportsComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    NgxPaginationModule,
    BlockUIModule.forRoot(),
    AutocompleteModule.forRoot(),
    NgIdleKeepaliveModule.forRoot()
  ],
  entryComponents: [CustomSessionTimeoutComponent],
  providers: [RegionService, UserService, LinkService, NavbarService, AuthGuard, LoginGuard, BusinessCatalogService, RegionCatalogService, RoleService, TagService, 
    InactivityService, ReportService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }],
 
  bootstrap: [AppComponent]
})
export class AppModule { }
