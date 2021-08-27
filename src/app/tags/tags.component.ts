import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { TagCatalog } from '../models/tag-catalog';
import { ToastrService } from 'ngx-toastr';
import { TagService } from '../services/tags.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {

  tags: Array<any>;
  tag: TagCatalog = new TagCatalog;
  newTag: TagCatalog = new TagCatalog;
  p: any;
  tagID: number;

  @ViewChild('AlertModal') AlertModal;
  @ViewChild('btnCloseAlert') btnCloseAlert: ElementRef;

  @ViewChild('EditModal') EditModal;
  @ViewChild('btnCloseEdit') btnCloseEdit: ElementRef;

  constructor(private tagService: TagService, public toastr: ToastrService) 
  { 
  }

  getTags(): void {
    this.tagService.getAll()
      .subscribe(
        response => {
          this.tags = response;
        },
        error => {
          this.showCustomError('Something went wrong. Please, contact support.');
        }
      )
  }

  OnSubmit(form: NgForm) {
   
   this.tagService.save(this.tag)
      .subscribe((data: any) => {
        this.tag.Name = '';
        if(data === "Exist"){
          this.showCustomError('Tag already exist.')
        }
        else{
          this.tag.Name = '';
          this.showSuccess('New record saved.');
          this.getTags();
          if (form != null){form.resetForm();}
        }
      },
        error => {
          this.showCustomError('Something went wrong. Please, contact support.');
        }) 
  }

  editTag() {
    this.tagService.update(this.tagID, this.newTag)
      .subscribe((data: any) => {
        this.newTag.Name = '';
        this.showSuccess('Record saved.');
        this.getTags();
        this.btnCloseEdit.nativeElement.click();

      },
        error => {
          this.showCustomError('Something went wrong. Please, contact support.');
        })
  }

  showEditModal(id) {
    this.tagID = id;
    this.newTag.ID =  this.tags.filter(u => u.ID == this.tagID)[0].ID;
    
    this.newTag.Name = this.tags.filter(u => u.ID == this.tagID)[0].Tag;
    this.EditModal.show();
   
  }

  delete(id: number) {
    this.tagService.delete(id).subscribe(
      (data: any) => {
        if(data.deleted.Error){
          this.showCustomError(data.deleted.Message);
        }else{       
          this.getTags();
          this.showSuccess(data.deleted.Message);
          this.btnCloseAlert.nativeElement.click();
        }
      },
      error => {
        this.showCustomError('Something went wrong. Please, contact support.');
      }
    )
  }

  showAlertModal(ID: number): void {
    this.tagID = ID;
    this.AlertModal.show();
  }

  showSuccess(text) {
    this.toastr.success(text, 'Success!');
  }


  showCustomError(text) {
    this.toastr.error(text, 'Oops!');
  }

  ngOnInit() {
    this.getTags();
  }

}
