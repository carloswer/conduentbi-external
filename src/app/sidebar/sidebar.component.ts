import { Component, OnInit, ViewChild, ElementRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserService } from '../shared/user.service';
import { RegionService } from '../services/region.service';
import { Router } from '@angular/router';
import { NavbarService } from '../navbar.service';
import { ContainerComponent } from '../container/container.component';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ItemLink } from "../models/itemLink";
import { TagService } from '../services/tags.service';
import { LinkService } from '../services/link.service';
import { ToastrService } from 'ngx-toastr';
import { InactivityService } from '../services/inactivity.service';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers:[ContainerComponent]
})
export class SidebarComponent extends DashboardComponent implements OnInit {
  userClaims:any = {};
  isAdmin:boolean = false;
  isAdminDemo:boolean = false;
  isLogOut = true;
  isLoggedIn: boolean;
  initialsUser: string; 
  business: Array<any>;
  //role:string;

  bsModalRef: BsModalRef;
  private element: any;
  businessSelect: any;
  selectedBusiness: any;
  disabledRegionsModal: boolean = true;
  hidden: boolean = true;
  lstRegions: Array<any>;
  regionModalId: number;
  selectedRegion:any;
  public tittle: string;
  public businessEdit: Array<any>;
  public linkItems: Array<any>;
  Link: ItemLink = new ItemLink;
  video: HTMLMediaElement;

  @ViewChild('AddModal') AddModal;
  @Input() childTemplate: TemplateRef<any>;


  constructor(   
     public _tagService:TagService,
     public linkService: LinkService,
     public toastr: ToastrService,
     public inactivityService: InactivityService,
     public vcr:ViewContainerRef,
     public userService: UserService,
     public regionService: RegionService,
     public router: Router,
     public nav: NavbarService,
     public container: ContainerComponent,
     public modalService: BsModalService,
    private el: ElementRef
    ) {
    super(
        regionService,userService,modalService,_tagService,
        nav,linkService,router,toastr,
        inactivityService,vcr
      );
  }

  ngOnInit() {
    this.GetUserClaims();

  }

  GetUserClaims(): void{
    this.userService.getUserClaims().subscribe((data: any) => {
      this.userClaims = data;
      this.isAdmin = this.userService.isRoleAdmin(this.userClaims.RoleId);
      if (this.userClaims.Role.includes('AdminDemo')) this.isAdminDemo = true;
      this.initialsUser = this.userClaims.FirstName.charAt(0) + this.userClaims.LastName.charAt(0);
      this.getAllBusiness(this.userClaims.UserName);
      //this.role=this.userClaims.Role;
      //alert(this.role);
    
    },
    error => {
      if (error.status == 401 || error.status == 500) {
        localStorage.removeItem('userToken');
        this.router.navigate(['/login']);
        this.nav.hide();
      }
      this.isLoggedIn = false;
      this.userService.setLogged(this.isLoggedIn);
    });
  }

  getAllBusiness(userName: string): void {
    this.regionService.getBusiness(userName)
    .subscribe(
      response => {
        this.business = response;
      },
      
      error => {
        console.log(error);
      }
    );

  }

  public setLink(newLink: string): void {
    this.regionService.setLink(newLink);
    this.container.ngOnInit();
   }

}