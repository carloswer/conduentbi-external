import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { LinkService } from "../../app/services/link.service";
import { RegionService } from '../services/region.service';
import { ItemLink } from "../models/itemLink";
import * as connection from '../connection';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RoleService } from '../services/roles.service';
import { RoleCatalog } from '../models/role-catalog';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  roles: Array<any>;
  role: RoleCatalog = new RoleCatalog;
  newRole: RoleCatalog = new RoleCatalog;
  p: any;
  roleID: string;

  @ViewChild('AlertModal') AlertModal;
  @ViewChild('btnCloseAlert') btnCloseAlert: ElementRef;

  @ViewChild('EditModal') EditModal;
  @ViewChild('btnCloseEdit') btnCloseEdit: ElementRef;

  constructor(
    private roleService: RoleService,
    public toastr: ToastrService
  ) {}

  getRoles(): void {
    this.roleService.getAll()
      .subscribe(
        response => {
          this.roles = response;
        },
        error => {
          this.showError('Something went wrong. Please, contact support.');
        }
      )
  }

  OnSubmit(form: NgForm) {
    this.roleService.save(this.role)
      .subscribe((data: any) => {
        this.role.Name = '';
        this.showSuccess('New record saved.');
        this.getRoles();
        if (form != null){form.resetForm();}
      },
        error => {
          this.showError('Something went wrong. Please, contact support.');
        })
  }

  editRole() {
    this.roleService.update(this.roleID, this.newRole)
      .subscribe((data: any) => {
        this.newRole.Name = '';
        this.showSuccess('Record saved.');
        this.getRoles();
        this.btnCloseEdit.nativeElement.click();
      },
        error => {
          this.showError('Something went wrong. Please, contact support.');
        })
  }

  showEditModal(id) {
    this.roleID = id;
    this.newRole = Object.assign({}, this.roles.filter(u => u.ID == this.roleID)[0]);
    this.EditModal.show();
  }

  delete(id: string) {
    this.roleService.delete(id).subscribe(
      (data: any) => {
        if(data.deleted.Error){
          this.showError(data.deleted.Message);
        }else{
          this.getRoles();
          this.showSuccess(data.deleted.Message);
          this.btnCloseAlert.nativeElement.click();
        }
      },
      error => {
        this.showError('Something went wrong. Please, contact support.');
      }
    )
  }

  showAlertModal(ID: string): void {
    this.roleID = ID;
    this.AlertModal.show();
  }

  showSuccess(text) {
    this.toastr.success(text, 'Success!');
  }

  showError(text) {
    this.toastr.error(text, 'Oops!');
  }

  ngOnInit() {
    this.getRoles();
  }

}
