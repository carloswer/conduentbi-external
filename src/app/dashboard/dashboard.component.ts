import { Component, OnInit, TemplateRef, ElementRef, ViewContainerRef,Directive, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { RegionService } from '../services/region.service';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';
import { NavbarService } from '../navbar.service';
import * as connection from '../connection';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { TagService } from '../services/tags.service';
import { LinkService } from "../services/link.service";
import { ToastrService } from 'ngx-toastr';
import { InactivityService } from "../services/inactivity.service";
import { ItemLink } from "../models/itemLink";
import { NgForm } from '@angular/forms';
import * as $ from 'jquery';

declare function require(name: string);
var FileSaver = require('file-saver');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
 
})

export class DashboardComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  @ViewChild('EditModal') EditModal;
  @ViewChild('btnCloseEdit') btnCloseEdit: ElementRef;
  @ViewChild('btnCloseAdd') btnCloseAdd: ElementRef;
  @ViewChild('AddModal') AddModal;
  @ViewChild('AlertModal') AlertModal;

  videoPath: string;
  server: string = connection.apiPath;
  public link: string = "";
  userClaims: any;
  isLoggedIn: boolean;
  disabledRegions: boolean = true;
  disabledRegionsModal: boolean = true;
  selectedBusiness: any;
  selectedRegion:any;
  // selectedRegion: any;
  isAdmin: boolean;
  hideVideo: boolean = true;
  searchParameter: string = "";
  itemLinkName :string ="";

  public linkItems: Array<any>;
  public lstRegions: Array<any>;
  public business: Array<any>;
  public title: string;
  public hidden: boolean = false;
  public currentLinkItem: any;
  modalRef: BsModalRef;
  video: HTMLMediaElement;
  selectedCountry: any;
  regionModal : any;
  regionModalId : number;
  selectedItem: any = '';
  inputChanged: any = '';
  tagItems: any[] = [];
  tags = [];
  config: any = { 'class': 'search-control', 'placeholder': 'Search', 'max': 10 }

  //Path
  public obj : { 
    Business: any, 
    Region: string, 
    Name: string,
    LogoPath: string,
    PowerBiLink: string };
  public arrayPath: Array<Object> = [];
  public splitPath : Array<string>;

  //Edit Info Dashboard
  regions: any;
  ID: number;
  IdDash: number;
  newLink: ItemLink = new ItemLink;
  selectedBusinessModal: any;
  selectedRegionModal: any;
  isRegionDisabled: boolean = true;
  itemlink: ItemLink = new ItemLink;
  Link: ItemLink = new ItemLink;
  checked: boolean = false;
  businessSelect : any;
  regionSelect: any;
  isEdit: boolean;
  public businessEdit: Array<any>;
  PowerBiDetails: any;


  id: number;
  row: number;
  row1: any;
  id1 :any;
  row2 : any;

  matrix = []

  constructor(
    public regionService: RegionService,
    public userService: UserService,
    public modalService: BsModalService,
    public tagService: TagService,
    public nav: NavbarService,
    public linkService: LinkService,
    public router: Router,
    public toastr: ToastrService,
    public inactivityService: InactivityService,
    vcr: ViewContainerRef) {
    this.video = document.getElementsByTagName('video')[0];
  }
getMatrix(){
  this.id = this.business.length;
  this.row = this.id / 3;
  this.row1 = Array(Math.ceil(this.row)).fill(1);
  this.id1 = Array(3).fill(0).map((_, index) => index + 1);
  this.row2 = Array(this.id).fill(1).map((_, index) => index + 1);
  var chunk_size = 3;
  var arr = this.business;
  var groups = arr.map(function (e, i) {
    return i % chunk_size === 0 ? arr.slice(i, i + chunk_size) : null;
  }).filter(function (e) { return e; });
  this.matrix = groups;
  // console.log(this.matrix);
}
  getAllBusiness(userName: string, isEdit): void {
    this.regionService.getBusiness(userName)
      .subscribe(
        response => {
          this.business = response;
          //console.log(this.business);
          var open = '';
          var current = '';
          $('body').on('click', '.business', function () {
            current = $(this).attr('href');
            if (open == current) {
              $('.panel-default').this.children('.panel-collapse').removeClass('in');
            } else {
              open = $(this).attr('href');
              $('.panel-default').not(this).children('.panel-collapse').removeClass('in');
            }

          });

          this.getMatrix();

          if (isEdit) {
            this.getBusiness();
            sessionStorage.selectedBusiness = this.selectedBusiness;
            sessionStorage.isEdit = true;
            this.renderBusiness(sessionStorage.selectedBusiness);
          }
        },

        error => {
          this.showError();
        }

      );
    // this.business = this.userService.business;
  }


  renderBusiness(currentBusiness:string){
    setTimeout(()=>{
      this.selectedBusiness = currentBusiness;
      this.businessSelect.target.value = this.selectedBusiness;
      this.selectRegion(this.selectedRegion);
      sessionStorage.clear();
    },5);
  }

  selectRegion(event): void {
    if(this.selectedRegion == null){this.selectedRegion = event};
    this.title = event.target.value;
    this.hidden = true;
    this.currentLinkItem = this.linkItems.filter(c => c.Name == this.title)[0].LinkItem;
    this.getPath();
    this.title === "Demo" ? this.playVideo() : this.stopVideo();
  }

  selectBusiness(event): void {
    this.businessSelect = event;
    this.video = document.getElementsByTagName('video')[0];
    this.selectedBusiness = event.target.value;
    this.disabledRegions = false;
    this.hidden = false;
    //r.name(regionname)
    this.linkItems = this.business.find(r => r.Name == this.selectedBusiness).Region;
    this.videoPath = connection.apiPath + this.business.find(r => r.Name == this.selectedBusiness).VideoPath;
    this.stopVideo();
    var event: any = {
      target: {
        value: this.linkItems[0].Name
      }
    }
    this.selectRegion(event)
  }


  closeCurrentModal(){
    this.modalRef.hide();
  }


  setLink(newLink: string) {
    this.regionService.setLink(newLink);
  }

  getCurrentUser(isEdit) {
    this.userService.getUserClaims().subscribe((data: any) => {
      this.userClaims = data;
      if (this.userClaims.Role.includes('Admin') || this.userClaims.Role.includes('AdminDemo')) this.isAdmin = true;    
      this.getAllBusiness(this.userClaims.UserName, isEdit);

    },
      error => {
        this.showError();
        if (error.status == 401 || error.status == 500) {
          localStorage.removeItem('userToken');
          this.router.navigate(['/login']);
          this.nav.hide();
        }
        this.isLoggedIn = false;
        this.userService.setLogged(this.isLoggedIn);
      });
  }

  getReport() {
    this.pageLoadStart();
    this.regionService.getRamosReport().subscribe(data => {
      var blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
      });
      const file = new File([blob], 'RamosReport.xls',
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
      FileSaver.saveAs(file);
      this.pageLoaded();
    },
      error => {
        this.pageLoaded();
      });
  }

  stopVideo() {
    this.hideVideo = true;
    this.video.pause();
    this.video.currentTime = 0;
  }

  playVideo() {
    this.hideVideo = false;
    this.video.load();
  }

  // AUTOCOMPLETE
  onSelect(item: any) {
    this.selectedItem = item;
    this.search();
  }

  onInputChangedEvent(val: string) {
    this.inputChanged = val;
  }

  autocomplete(text: string) {
    if (text.length > 1) {
      this.tagService.search(text).subscribe((response: any) => {
        this.tags = response;
      });
    }

    if (text.length == 0) {
      this.selectedItem = '';
      this.currentLinkItem = [];
    }
  }

  search() {
    this.linkService.searchLink(this.searchParameter).subscribe((data: Array<any>) => {
      this.currentLinkItem = data;
      this.getPath();
      this.hidden = true;
      if (data.length === 0) {
        this.showCustomError('Any result found, please change your search criteria');
      }
    },
      error => {
        this.showError();
      });
  }

  // *-*--*--*-*-*--*-*
  pageLoadStart() {
    this.blockUI.start("Please wait... This may take a while");
  }

  pageLoaded() {
    this.blockUI.stop();
  }

  showSuccess() {
    this.toastr.success('Record saved.', 'Success!');
  }

  showError() {
    this.toastr.error('Something went wrong. Please, contact support.', 'Oops!');
  }

  showCustomError(text) {
    this.toastr.error(text, 'Oops!');
  }

  showCustomSuccess(text) {
    this.toastr.success(text, 'Success!');
  }

  getPath(){
    this.arrayPath = [];
    var strPath: any;
    for(let i in this.currentLinkItem){
      strPath = this.currentLinkItem[i].Path;
      this.splitPath = strPath.split('/', 2);
      var obj = {
        Business: this.splitPath[0],
        Region: this.splitPath[1],
        Id:this.currentLinkItem[i].Id,
        Name: this.currentLinkItem[i].Name, 
        PowerBiLink: this.currentLinkItem[i].PowerBiLink,
        ActiveReport: this.currentLinkItem[i].ActiveReport,
        LogoPath: this.currentLinkItem[i].LogoPath,
        RegionID: this.currentLinkItem[i].RegionID
      }

      this.arrayPath[i] = obj;
    }
    //console.log(this.arrayPath);
  }

//Edit Modal
GetAllBusiness(): void {
  this.regionService.getAllBusiness()
    .subscribe(
      response => {
        this.businessEdit = response;
        this.getBusiness();
      },
      error => {
        this.showCustomError('Any result found, please change your search criteria');
      }
    )
}

getRegion(businessSelect): void {
  this.title = businessSelect.target.value;
  this.hidden = true;
  this.currentLinkItem = this.linkItems.filter(c => c.Name == this.title)[0].LinkItem;
  this.getPath();
  this.title === "Demo" ? this.playVideo() : this.stopVideo();
}

getBusiness(): void {
  this.video = document.getElementsByTagName('video')[0];
  this.selectedBusiness = this.businessSelect.target.value;
  this.disabledRegions = false;
  this.hidden = false;
  this.linkItems = this.business.find(r => r.Name == this.selectedBusiness).Region;
  this.videoPath = connection.apiPath + this.business.find(r => r.Name == this.selectedBusiness).VideoPath;
  this.stopVideo();
  var businessSelect: any = {
    target: {
      value: this.linkItems[0].Name
    }
  }
  this.getRegion(businessSelect)
}

onChangeBusiness(event) {
  var businessID = event;
  this.regionService.getRegionsByBusinessID(businessID).subscribe(
    response => {
      this.isRegionDisabled = false;
      this.regions = response;
    },
    error => {
      this.showError();
    }
  )
}

showEditModal(id: number): void {
  this.linkService.getLinkById(id).subscribe(
    response => {
      this.ID = id;
      this.newLink = response;
      this.selectedBusinessModal = response.BusinessID;
      this.onChangeBusiness(this.selectedBusinessModal);
      this.selectedRegionModal = response.RegionID;
      this.EditModal.show();
    },
    error => {
      this.showError();
    }
  );
}

editLink(){
  var linkID = this.ID;
  this.newLink.RegionID = this.selectedRegionModal;
  this.linkService.updateLink(linkID, this.newLink).subscribe(
    response => {
      this.btnCloseEdit.nativeElement.click();
      this.resetForm();
      this.showSuccess();
      //this.getPowerBiDetails(linkID);
      //this.GetAllBusiness();
      this.getCurrentUser(true);
    },
    error => {
      this.showError();
    }
  )
}
// Fin Edit Modal

//Add Link
submitLink() {
  this.Link.RegionID = this.regionModalId;
  this.linkService.saveLink(this.Link)
    .subscribe((data: any) => {
      this.closeCurrentModal();
      //this.resetFormAdd(form);
      window.location.reload();
      
    },
      error => {
        this.showError();
      })
}

resetFormAdd(form?: NgForm) {
  if (form != null){form.resetForm();}
  //this.newLink = new ItemLink;
  //this.link = new ItemLink;
  this.Link.RegionID = null;
  this.checked = false;
  this.selectedBusiness= "undefined";
  this.selectedRegion= "undefined";

}

resetForm() {
  this.newLink = new ItemLink;
  this.itemlink = new ItemLink;
  this.checked = false;
}

public showAddModal(template: TemplateRef<any>) {
  const config: ModalOptions = {
    backdrop: 'static',
    keyboard: false,
    ignoreBackdropClick: true
  };

  this.modalRef = this.modalService.show(template, config);
}


selectBusiness2(event): void {
  this.businessSelect = event;
  this.video = document.getElementsByTagName('video')[0];
  this.selectedBusiness = event.target.value;
  this.disabledRegionsModal = false;
  this.hidden = false;
  this.lstRegions = this.business.find(r => r.Name == this.selectedBusiness).Region;
  this.regionModalId = this.lstRegions[0].Id;
}
// Fin  AddLink

// Show modal for delete
showAlertModal(ID: number): void {
  this.IdDash = ID;
  this.AlertModal.show();
}

//Delete LinkItem
 deleteLink(id): void {
   this.linkService.delete(id).subscribe((data: any) => {
     if(data.result.Error){
       this.showCustomError(data.result.Message);
    
     }else{       
      /*let index = this.links.findIndex(u => u.Id === id);
       this.links.splice(index, 1);
       this.changeDetectorRefs.detectChanges();
       this.changeDetectorRefs.markForCheck();
       this.getLinks();*/
       this.AlertModal.hide()
       //this.btnCloseAlert.nativeElement.click();
       this.showCustomSuccess(data.result.Message);  
       this.getCurrentUser(true);
     }
 
   },
     error => {
       this.showCustomError('Something went wrong. Please, contact support.');
     })
}
//End Delete LinkItem


  addClass() {
    document.querySelector('body').classList.add('background');
  }
  ngOnInit() {
    //this.inactivityService.startWatching();
    this.getCurrentUser(false);
    this.GetAllBusiness();
 
    //this.addClass();
  }

}


@Directive({ selector: '[BackgroundDirective]' })
export class BackgroundDirective implements OnDestroy, AfterViewInit {
  ngAfterViewInit() {
    document.querySelector('body').classList.add('background');
  }
  ngOnDestroy(): void {
    document.querySelector('body').classList.remove('background');
    document.querySelector('body').classList.add('white');

  }
}