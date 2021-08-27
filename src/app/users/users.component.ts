import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, ViewContainerRef, Input } from '@angular/core';
import { UserService } from '../shared/user.service';
import { User } from '../shared/user.model';
import { Role } from "../models/role";
import { FormControl, Validators, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Generic } from '../models/generic';
import { RegionService } from '../services/region.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: Array<any>;
  userCount: number;
  userClaims: any;
  isAdmin: boolean;
  deletedUser: any;
  businessByRole:  Array<any>;
  showBusiness: boolean = false;
  showEditBusiness: boolean = false;
  selectedRole: Array<string>;
  rolesByUser: Array<string>;
  p: any;

  //user: any={};
  user: any;
  //model: any={};
 
  selectedUser: User = new User;
  emailPattern = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$";
  roles: Array<any>;
  completeRoles: Array<Role>;
  selectedBusiness: any;
  selectedEditBusiness: any;
  searchText: string;

  selectedRegion:any;
  rolName: any;
  regionsByBusiness: Array<Generic>;
  selectedEditRegion: any;
  showRegions: boolean = false;
  showEditRegion: boolean = false;
  regions: Array<any>;
  newBusinessSelected:Array<number>;
  newRegionSelected:Array<number>;
  //txtEditWinId: any;

  name:string;

  business: any;
  
  
  @ViewChild('AlertModal') AlertModal;
  @ViewChild('btnCloseAlert') btnCloseAlert: ElementRef;

  @ViewChild('EditModal') EditModal;
  @ViewChild('btnCloseEdit') btnCloseEdit: ElementRef;

  constructor(
    private userService: UserService,
    private changeDetectorRefs: ChangeDetectorRef,
    public toastr: ToastrService,
    private regionService: RegionService
  ) {}

  onChangeRole(selectedRole) {
    this.selectedRole = selectedRole;
    this.rolName = '';
    if (this.selectedRole.length >= 1) {

      if(this.selectedRole.length == 1){
        this.rolName = this.completeRoles.filter(x => x.RoleList.value == selectedRole)[0].RoleList.label;
      }
      
      //var roleID = this.selectedRole[0];
      //cargar business de roles seleccionados
      // this.businessByRole = this.completeRoles.find(r => r.RoleList.value == roleID).BusinessList;
     
      if(this.rolName == 'AdminDemo'){
        this.businessByRole = this.completeRoles;
        this.businessByRole = this.businessByRole.map(function (r) { return r.BusinessList }).reduce(function (a, b) { return a.concat(b); });
      }else{
        this.businessByRole = this.completeRoles.filter(b => this.selectedRole.indexOf(b.RoleList.value) > -1);
        this.businessByRole = this.businessByRole.map(function (r) { return r.BusinessList }).reduce(function (a, b) { return a.concat(b); });
      }

      if (this.businessByRole.length >= 1) {
        this.showBusiness = true;
        this.selectedBusiness = [];
        this.selectedRegion = [];
      }
      else {
        this.showBusiness = false;
      }
      
    }
    else {
      this.showBusiness = false;
      this.showRegions = false;
    }
  }

  GetAllBusiness(): void {
    this.regionService.getAllBusiness()
      .subscribe(
        response => {
          this.business = response;
        },
        error => {
          console.log(error);
        }
      )
  }

  onChangeBusiness(selectedBusiness) {
    this.selectedBusiness = selectedBusiness;

    if (this.selectedBusiness.length >= 1) {

      //cargar regiones de los business seleccionados
      this.regionsByBusiness = this.businessByRole.filter(b => this.selectedBusiness.indexOf(b.value) > -1);
      this.regionsByBusiness = this.regionsByBusiness.map(function (r) { return r.RegionList }).reduce(function (a, b) { return a.concat(b); });

      if (this.regionsByBusiness.length >= 1) {
       
        this.showRegions = true;
        this.selectedRegion = [];
      }
      else {
        this.showRegions = false;
      }

    
    }
      else {
        this.showRegions = false;
      }
  }

  onChangeRegions(selectedRegion) {
    this.selectedRegion = selectedRegion;
  }



  onChangeEditRole(rolesByUser) {
    this.rolesByUser = rolesByUser;
    if (this.rolesByUser.length >= 1) {
      this.businessByRole = this.completeRoles.filter(b => this.rolesByUser.indexOf(b.RoleList.value) > -1);
      this.businessByRole = this.businessByRole.map(function (r) { return r.BusinessList }).reduce(function (a, b) { return a.concat(b); });
      this.rolName = this.completeRoles.filter(x => x.RoleList.value == rolesByUser)[0].RoleList.label;
      console.log(this.rolName);
      if (this.businessByRole.length >= 1) {      
        this.showEditBusiness = true;
        //Agarro solo el id del arreglo businessbyrole para compararlo despues
        this.newBusinessSelected=this.businessByRole.map(bu=>+bu.value);
        //Comparar los business de la bd con los nuevos y setear los seleccionados ya fiiltrados (seleccionado con lo nuevo seleccionado)
        this.selectedEditBusiness= this.selectedEditBusiness.filter(item => this.newBusinessSelected.includes(item));
        //Seleccionar las regiones de los businessbyrole y encontrarlos en la regionlist
        this.regionsByBusiness = this.businessByRole.find(b=>b.RegionList).RegionList;
         //Agarro solo el id del arreglo regionsByBusiness para compararlo despues (lo seleccionado con lo nuevo seleccionado)
        this.newRegionSelected=this.regionsByBusiness.map(r=>+r.value);
        //Comparar lo seleccionado con lo nuevo seleccionado
        this.selectedEditRegion= this.selectedEditRegion.filter(item => this.newRegionSelected.includes(item));
      }
      else {
        this.showEditBusiness = false;
      }
    }
    else {
      this.selectedEditBusiness=[];
      this.selectedEditRegion=[];
      this.showEditBusiness = false;
      this.showEditRegion=false;
    }
  }


  onChangeEditBusiness(selectedEditBusiness) {
    //Convertir id string to int
    this.selectedEditBusiness = selectedEditBusiness.map(Number);

    if (this.selectedEditBusiness.length >= 1) {
     
      //cargar regiones de los business seleccionados
      this.regionsByBusiness = this.businessByRole.filter(b => this.selectedEditBusiness.indexOf(+b.value) > -1);
      this.regionsByBusiness = this.regionsByBusiness.map(function (r) { return r.RegionList }).reduce(function (a, b) { return a.concat(b); });
      this.newRegionSelected=this.regionsByBusiness.map(r=>+r.value);
      //Comparar lo seleccionado con lo nuevo seleccionado
      this.selectedEditRegion= this.selectedEditRegion.filter(item => this.newRegionSelected.includes(item));

      if (this.regionsByBusiness.length >= 1) {
       
        this.showEditRegion = true;
       
      }
      else {
        this.showEditRegion = false;
      }

    
    }
      else {
        this.selectedEditRegion=[];
        this.showEditRegion = false;
      }
  }


  onChangeEditRegions(selectedEditRegion) {
    //Convertir id string to int
    this.selectedEditRegion = selectedEditRegion.map(Number);

  }


  showSuccess(text) {
    this.toastr.success(text, 'Success!');
  }

  showError(text) {
    this.toastr.error(text, 'Oops!');
  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe(
        response => {
          this.users = response;
          this.userCount = response.length;
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
          this.completeRoles = response;
          this.roles = response;
          this.roles = this.roles.map(({ RoleList }) => RoleList);
        },
        error => {
          this.showError('Something went wrong. Please, contact support.');
        }
      )
  }

  deleteUser(id): void {
    this.userService.deleteUser(id).subscribe((data: any) => {
      if(data.Error){
        this.showError(data.Message);
      }else{       
        this.getUsers();
        this.btnCloseAlert.nativeElement.click();
        this.showSuccess(data.Message);      
      }
    
    },
      error => {
        this.showError('Something went wrong. Please, contact support.');
      })
  }


  getCurrentUser() {
    this.userService.getUserClaims().subscribe((data: any) => {
      this.userClaims = data;
      var roleId = data.RoleId;
      this.isAdmin = this.userService.isRoleAdmin(roleId);
    },
      error => {
        this.showError('Something went wrong. Please, contact support.');
      });
  }


  resetForm(form?: NgForm) {
    if (form != null)
    form.resetForm();
    this.user = {
      UserName: '',
      Password: '',
      Email: '',
      FirstName: '',
      LastName: '',
      RoleID: '',
      BusinessList: [],
      RegionList:[],
      WinId: '',
      ExternalAccess: false
    }
    this.selectedBusiness = [];
    this.selectedRole = [];
    this.selectedRegion=[];
    this.businessByRole=[];
    this.regionsByBusiness=[];
    this.showRegions = false;
    this.showBusiness = false;
  }

  OnSubmit(form: NgForm) {
    console.log("Form: " + form);
    form.value.BusinessList = this.selectedBusiness;
    form.value.RoleID = this.selectedRole;
    form.value.RegionList = this.selectedRegion;
    form.value.Password= this.user.Password;
    form.value.WinId = this.user.WinId;
    
    this.userService.registerUser(form.value)
      .subscribe((data: any) => {
        if (data.Succeeded == true) {
          this.resetForm(form);
          this.getUsers();
          this.changeDetectorRefs.detectChanges();
          this.changeDetectorRefs.markForCheck();
          this.showSuccess('New record saved.');
        }
        else{
          this.showError(data.Errors[0]);
       }
      }); 
  }

  editUser() {
    this.selectedUser.RoleID = this.rolesByUser;
    this.selectedUser.BusinessList = this.selectedEditBusiness;
    this.selectedUser.RegionList=this.selectedEditRegion;
    //this.selectedUser.WinId=this.txtEditWinId;
    this.userService.updateUser(this.selectedUser.Id, this.selectedUser).subscribe(
      response => {
        this.showSuccess('Record saved.');
        this.EditModal.hide();
        this.getUsers();
      },
      error => {
        this.showError('Something went wrong. Please, contact support.');
      }
    )  
  }

  showAlertModal(userID: number): void {
    this.selectedUser = this.users.filter(u => u.Id == userID)[0];
    this.AlertModal.show();
  }

  showEditModal(userID: number): void {

   // this.resetForm();
    this.selectedUser = Object.assign({}, this.users.filter(u => u.Id == userID)[0]);
    this.rolesByUser = this.selectedUser.RoleList;

    if(this.selectedUser.BusinessList.length>=1 && this.selectedUser.RegionList.length>=1){

  //todos los business dependiendo de los roles seleccionados
    this.businessByRole= this.completeRoles.filter(bi => this.rolesByUser.indexOf(bi.RoleList.value)>-1);
    this.businessByRole= this.businessByRole.map(function(r){return r.BusinessList}).reduce(function(a,bi){return a.concat(bi);});

    
    //Seleccionar los business que tiene asigandos el usuario
    this.selectedEditBusiness = this.selectedUser.BusinessList;
    
    //todas las regions dependiendo de las business seleccionados

    this.regionsByBusiness=this.businessByRole.filter(r=>this.selectedEditBusiness.indexOf((+r.value))>-1);
    this.regionsByBusiness= this.regionsByBusiness.map(function(re){return re.RegionList}).reduce(function(a,b){return a.concat(b);});

    //Seleccionar las regiones que tiene asignados el usuario
    this.selectedEditRegion = this.selectedUser.RegionList;
    if(this.selectedEditBusiness.length>=1){this.showEditBusiness = true;};
    if(this.selectedEditRegion.length>=1){this.showEditRegion= true;};
    }


    this.EditModal.show();
  }


  onKeyFirstName(event: any) { // without type info
    //this.values += event.target.value + ' | '; 
    this.user.UserName= event.target.value.charAt(0)+this.user.LastName;
    this.user.UserName= this.user.UserName.toLowerCase();
    
  }

  onKeyLastName(event: any) { // without type info
    this.user.UserName= this.user.FirstName.charAt(0)+event.target.value;
    this.user.UserName= this.user.UserName.toLowerCase();
    this.onChangeUsername();
  }


 randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

onChangeUsername() {
  this.user.Password=this.randomString(6, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!*');
 // alert(this.user.Password);

}


  ngOnInit() {
    this.getRoles();
    this.getUsers();
    this.resetForm(); 
    this.GetAllBusiness();
  }

}