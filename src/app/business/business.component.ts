import { Component, OnInit, ViewContainerRef, ElementRef, ViewChild } from '@angular/core';
import { BusinessCatalog } from "../models/business-catalog";
import { BusinessCatalogService } from "../services/business-catalog.service";
import { UserService } from '../shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { Region } from '../models/region';
import { RegionService } from '../services/region.service';
import { RegionCatalogService } from '../services/region-catalog.service';
import { NumberValueAccessor } from '@angular/forms/src/directives';
import { FormGroup, FormControl,NgForm } from '@angular/forms';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})
export class BusinessComponent implements OnInit {

  business: BusinessCatalog = new BusinessCatalog;
  selectedBusiness: BusinessCatalog = new BusinessCatalog;
  businessID: number;
  businesses: Array<any>;
  selectedRole: string;
  roles: Array<any>;
  region: Region = new Region;
  selectedRegion: Region = new Region;
  regions: Array<Region>;
  modalTitle: string;
  modalShowName: string;
  elementIdToDelete:number;
  p: any;
  r: any;
  form: FormGroup = new FormGroup({
    filename: new FormControl(),
    filetype: new FormControl(),
    value: new FormControl()
  })
  loading: boolean = false;
  checked: boolean = false;

  @ViewChild('AlertModal') AlertModal;
  @ViewChild('btnCloseAlert') btnCloseAlert: ElementRef;

  @ViewChild('EditModal') EditModal;
  @ViewChild('EditRegionModal') EditRegionModal;
  @ViewChild('btnCloseEditRegion') btnCloseEditRegion: ElementRef;
  @ViewChild('btnCloseEdit') btnCloseEdit: ElementRef;

  constructor(
    private businessService: BusinessCatalogService,
    public toastr: ToastrService,
    vcr: ViewContainerRef,
    public userService: UserService,
    public regionService: RegionService,
    public regionCatalogService: RegionCatalogService) {
  }

  OnSubmit(form: NgForm) {
    //debugger;
    this.business.RoleID = this.selectedRole;
    this.businessService.save(this.business)
      .subscribe((data: any) => {
        this.showSuccess('New record saved.');
        this.getBusinesses();
        this.resetForm(form);
      },
        error => {
          this.showError('Something went wrong. Please, contact support.');
        })
  }

  resetForm(form?: NgForm) {
    if (form != null){form.resetForm();}
    this.business = new BusinessCatalog;
    this.selectedRole = "undefined";
   
  }

  showSuccess(text) {
    this.toastr.success(text, 'Success!');
  }

  showError(text) {
    this.toastr.error(text, 'Oops!');
  }

  getBusinesses(): void {
    this.businessService.getAll()
      .subscribe(
        response => {
          this.businesses = response;
        },
        error => {
          this.showError('Something went wrong. Please, contact support.');
        }
      )
  }

  getRoles(): void {
    this.userService.getRoles()
      .subscribe(
        response => {
          this.roles = response;
          this.roles = this.roles.map(({ RoleList }) => RoleList);
        },
        error => {
          this.showError('Something went wrong. Please, contact support.');
        }
      )
  }

  onChangeRole(selectedRole) {
    this.selectedRole = selectedRole;
  }

  showAlertModal(id: number, modalType: string, name: string): void {
    this.elementIdToDelete = id;
    this.modalTitle = modalType;
    this.modalShowName = name;
    this.AlertModal.show();
  }

  showEditModal(id: number): void {
    this.selectedBusiness = Object.assign({}, this.businesses.filter(u => u.ID == id)[0]);
    this.selectedRole = this.roles.filter(r => r.label == this.selectedBusiness.RoleName)[0].value;
    this.EditModal.show();
  }

  delete(elementType: string) {
    switch (elementType) {
      case "business":
        this.businessService.delete(this.elementIdToDelete).subscribe(
          (data: any) => { 
            if(data.deleted.Error){
              this.showError(data.deleted.Message);
            
            }else{       
              this.getBusinesses();
              this.btnCloseAlert.nativeElement.click();
              this.showSuccess(data.deleted.Message);  
            }
          },
          error => {
            this.showError('Something went wrong. Please, contact support.');
          }
        )
        break;
      case "region":
        this.regionCatalogService.delete(this.elementIdToDelete).subscribe((data: any) => {
            if(data.deleted.Error){
              this.toastr.error(data.deleted.Message, data.deleted.Title);
            }else{       
              this.getRegions();
              this.btnCloseAlert.nativeElement.click();
              this.showSuccess(data.deleted.Message);       
            }
          },
          error => {
            this.showError('Something went wrong. Please, contact support.');
          }
        )
      default:
        break;
    }
  }

  editBusiness() {
    var businessID = this.selectedBusiness.ID;
    this.business = this.selectedBusiness;
    this.business.RoleID = this.selectedRole;
    this.businessService.update(businessID, this.business)
      .subscribe((data: any) => {
        //this.resetForm();
        this.showSuccess('Record saved.');
        this.getBusinesses();
        this.btnCloseEdit.nativeElement.click();
      },
        error => {
          this.showError('Something went wrong. Please, contact support.');
        })
  }

  // uploadVideo(event){
  //   debugger;
  //   let reader = new FileReader();
  //   if(event.target.files && event.target.files.length > 0){
  //     let file = event.target.files[0];
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       this.form.get('video').setValue({
  //         filename: file.name,
  //         filetype: file.type,
  //         value: (reader.result as string).split(',')[1]
  //       })
  //     }
  //   }
  // }

  uploadVideo(event){
    let fileList: FileList = event.target.files;
    if(fileList.length > 0){
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('video', file, file.name);
    }
  }

  submitVideo(){
    const formModel = this.form.value;
    this.loading = true;
    //alert('done!');
    this.loading = false;
  }

  //REGIONS
  getRegions() {
    this.regionService.getRegions().subscribe(
      response => {
        this.regions = response;
      },
      error => {
        this.showError('Something went wrong. Please, contact support.');
      }
    )
  }

  onChangeBusiness(selectedBusiness) {
    this.businessID = selectedBusiness;
  }

  submitRegion(form?: NgForm) {
     this.region.BusinessID = this.businessID;
    this.regionCatalogService.save(this.region).subscribe(
      response => {
        this.region = new Region;
        this.showSuccess('New record saved.');
        this.getRegions();
        if (form != null){form.resetForm();}

      },
        error => {
          this.showError('Something went wrong. Please, contact support.');
        }
    )
  }

  showRegionEditModal(id: number): void {
    this.selectedRegion = Object.assign({}, this.regions.filter(u => u.ID == id)[0]);
    this.selectedBusiness = Object.assign({}, this.businesses.filter(u => u.ID == this.selectedRegion.BusinessID)[0]);
    this.EditRegionModal.show();
  }

  editRegion() {
    var regionID = this.selectedRegion.ID;
    var newRegion = new Region;
    newRegion.Name = this.selectedRegion.Name;
    newRegion.BusinessID = this.selectedBusiness.ID;
    this.regionCatalogService.update(regionID, newRegion)
      .subscribe((data: any) => {
        this.selectedRegion = new Region;
        this.showSuccess('Record saved.');
        this.getRegions();
        this.btnCloseEditRegion.nativeElement.click();
      },
        error => {
          this.showError('Something went wrong. Please, contact support.');
        })
  }

  ngOnInit() {
    this.getRoles();
    this.getBusinesses();
    this.getRegions();
  }

}
