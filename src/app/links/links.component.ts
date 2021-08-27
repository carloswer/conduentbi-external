import { Tag } from './../models/tag';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { LinkService } from "../../app/services/link.service";
import { RegionService } from '../services/region.service';
import { ItemLink } from "../models/itemLink";
import * as connection from '../connection';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.css']
})
export class LinksComponent implements OnInit {

  private server: string = connection.apiPath;
  links: any;
  regions: any;
  business: any;
  link: ItemLink = new ItemLink;
  newLink: ItemLink = new ItemLink;
  selectedBusiness: any;
  selectedRegion: any;
  selectedBusinessModal: any;
  selectedRegionModal: any;
  isRegionDisabled: boolean = true;
  checked: boolean = false;
  ID: number;
  private base64textString: string = "";
  p: any;
  isSelect: boolean = false;
  tagsAvailable: Array<Tag> = [];
  tagsAssigned: Array<Tag> = [];
  tagsTemp: Array<Tag> = [];
  enable: boolean = false;
  _tag: Tag;
  _error: boolean = false;
  searchText: string;
  linkCount: number;

  @ViewChild('AlertModal') AlertModal;
  @ViewChild('btnCloseAlert') btnCloseAlert: ElementRef;

  @ViewChild('EditModal') EditModal;
  @ViewChild('btnCloseEdit') btnCloseEdit: ElementRef;

  @ViewChild('TagModal') TagModal;
  @ViewChild('btnCloseTag') btnCloseTag: ElementRef;

  constructor(private linkService: LinkService,
    private regionService: RegionService,
    private changeDetectorRefs: ChangeDetectorRef,
    public toastr: ToastrService) {
  }

  getLinks(): void {
    this.linkService.getLinks()
      .subscribe(
        response => {
          this.links = response;
          this.linkCount = response.length;
        },
        error => {
          this.showError('Something went wrong. Please, contact support.');
        }
      )
  }

  GetAllBusiness(): void {
    this.regionService.getAllBusiness()
      .subscribe(
        response => {
          this.business = response;
        },
        error => {
          this.showError('Something went wrong. Please, contact support.');
        }
      )
  }

  onChangeBusiness(event) {
    var businessID = event;
    this.regionService.getRegionsByBusinessID(businessID).subscribe(
      response => {
        this.isRegionDisabled = false;
        this.regions = response;
      },
      error => {
        this.showError('Something went wrong. Please, contact support.');
      }
    )
  }

  handleFileSelect(evt) {
    this.base64textString = "";
    var files = evt.target.files;
    var file = files[0];

    if (files && file) {
      var reader = new FileReader();

      reader.onload = this._handleReaderLoaded.bind(this);

      reader.readAsBinaryString(file);
      this.checked = true;
    }
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
        this.showError('Something went wrong. Please, contact support.');
      }
    );
  }

  editLink(): void {
    var linkID = this.ID;
    // var fileInput = (<HTMLInputElement>document.getElementById('imageFileEdit')).value;
    // var fileName = fileInput.split(/(\\|\/)/g).pop();
    // this.newLink.Image = this.base64textString;
    // this.newLink.ImageName = fileName;
    this.newLink.RegionID = this.selectedRegionModal;
    this.linkService.updateLink(linkID, this.newLink).subscribe(
      response => {
        this.btnCloseEdit.nativeElement.click();
       // this.resetForm();
        this.showSuccess('Record saved.');
        this.getLinks();
     
      },
      error => {
        this.showError('Something went wrong. Please, contact support.');
      }
    )
  }

  // Show modal for delete
  showAlertModal(ID: number): void {
    this.ID = ID;
    this.AlertModal.show();
  }

  deleteLink(id): void {
    this.linkService.delete(id).subscribe((data: any) => {
      if(data.result.Error){
        this.showError(data.result.Message);
      
      }else{       
        let index = this.links.findIndex(u => u.Id === id);
        this.links.splice(index, 1);
        this.changeDetectorRefs.detectChanges();
        this.changeDetectorRefs.markForCheck();
        this.getLinks();
        this.btnCloseAlert.nativeElement.click();
        this.showSuccess(data.result.Message);  
      }
   
    },
      error => {
        this.showError('Something went wrong. Please, contact support.');
      })
  }

  OnSubmit(form: NgForm) {
    //var fileInput = (<HTMLInputElement>document.getElementById('imageFile')).value;
    //var fileName = fileInput.split(/(\\|\/)/g).pop();
    //this.link.Image = this.base64textString;
    //this.link.ImageName = fileName;
    this.link.RegionID = this.selectedRegion;

    this.linkService.saveLink(this.link)
      .subscribe((data: any) => {
        this.resetForm(form);
        this.showSuccess('New record saved.');
        this.getLinks();
     
       
      },
        error => {
          this.showError('Something went wrong. Please, contact support.');
        })
  }

  // Show modal for assign tag
  showTagModal(id: number): void {
    this.ID = id;
    this.getTagAvailable(id)
    this.TagModal.show();
  }

  getTagAvailable(id: number) {
    this.linkService.getTagAvailable(id).subscribe(response => {
      this.tagsAvailable = response.AvailableTags;
      this.tagsAssigned = response.AssignedTags;
    },
      error => {
        this.showError('Something went wrong. Please, contact support.');
      });
  }

  selectItem(t: Tag) {
    t.isSelect = !t.isSelect;
    this._tag = t;
    this._error = false;

    if (t.isSelect) {
      this.tagsTemp.push(t);
    } else {
      let updateAssigned = [];

      for (let i of this.tagsTemp) {
        if (i !== t) {
          updateAssigned.push(i);
        }
      }
      this.tagsTemp = updateAssigned;
    }

    if (this.tagsTemp.length > 1) {
      this.enable = true;
    }

    if (this.tagsTemp.length <= 1) {
      this.enable = false;
    }
  }

  addOne() {
    if (this.tagsTemp.length > 0) {
      this.tagsTemp = [];
      this.tagsAssigned.push(this._tag);
      this.unselectTags(this.tagsAssigned);

      let updateAvailable = [];
      for (let i of this.tagsAvailable) {
        if (i !== this._tag) {
          updateAvailable.push(i);
        }
      }

      this.tagsAvailable = updateAvailable;
      this.enable = false;
    } else {
      this._error = true;
    }
  }

  removeOne() {
    if (this.tagsTemp.length > 0) {
      this.tagsTemp = [];
      this.tagsAvailable.push(this._tag);
      this.unselectTags(this.tagsAvailable);

      let updateAssigned = [];
      for (let i of this.tagsAssigned) {
        if (i !== this._tag) {
          updateAssigned.push(i);
        }
      }

      this.tagsAssigned = updateAssigned;
      this.enable = false;
    } else {
      this._error = true;
    }
  }

  addMany() {
    if (this.tagsTemp.length > 0) {
      let updateAvailable = [];

      this.tagsTemp.forEach(item => {
        this.tagsAssigned.push(item);
      });
      this.tagsTemp = [];
      this.unselectTags(this.tagsAssigned);

      for (let i of this.tagsAvailable) {
        if (!this.tagsAvailable.some(t => this.tagsAssigned.includes(i))) {
          updateAvailable.push(i);
        }
      }

      this.tagsAvailable = updateAvailable;
      this.enable = false;
    } else {
      this._error = true;
    }
  }

  removeMany() {
    if (this.tagsTemp.length > 0) {
      let updateAssigned = [];

      this.tagsTemp.forEach(item => {
        this.tagsAvailable.push(item);
      });

      this.unselectTags(this.tagsAvailable);

      for (let i of this.tagsAssigned) {
        if (!this.tagsAssigned.some(t => this.tagsAvailable.includes(i))) {
          updateAssigned.push(i);
        }
      }

      this.tagsAssigned = updateAssigned;
      this.tagsTemp = [];
      this.enable = false;
    } else {
      this._error = true;
    }
  }

  saveTags(tags) {

    this.linkService.manageTags(this.ID, tags).subscribe(response => {
      if (response) {
        this.TagModal.hide();
        this.showSuccess('New record saved.');
      }
      else {
        this.showError('Something went wrong. Please, contact support.');
      }
    },
      error => {
        this.showError('Something went wrong. Please, contact support.');
      });
  }

  cancelTags() {
    this.tagsAvailable = this.tagsAvailable;
    this.tagsAssigned = this.tagsAssigned;
    this.tagsTemp = [];
    this._tag = new Tag;
    this._error = false;
    this.enable = false;
    this.unselectTags(this.tagsAssigned);
    this.unselectTags(this.tagsAvailable);
    this.TagModal.hide();
  }

  unselectTags(tags) {
    tags.forEach(item => {
      item.isSelect = false;
    });
  }

  resetForm(form?: NgForm) {
    if (form != null){form.resetForm();}
    //this.newLink = new ItemLink;
    //this.link = new ItemLink;
    this.link.RegionID = null;
    this.checked = false;
    this.selectedBusiness= "undefined";
    this.selectedRegion= "undefined";

  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString = btoa(binaryString);
  }

  showSuccess(text) {
    this.toastr.success(text, 'Success!');
  }

  showError(text) {
    this.toastr.error(text, 'Oops!');
  }

  ngOnInit() {
    this.GetAllBusiness();
    this.getLinks();
  }
}
