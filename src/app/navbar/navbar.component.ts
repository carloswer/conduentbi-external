import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm, Validators,FormControl } from '@angular/forms';
import { UserService } from '../shared/user.service';
import { NavbarService } from '../navbar.service';
import { RegionService } from '../services/region.service';
import { ContainerComponent } from '../container/container.component';
// import 'bootstrap/dist/js/bootstrap.js';
import * as $ from 'jquery';
import { InactivityService } from "../services/inactivity.service";
import { ToastrService } from 'ngx-toastr';
import { UpdatePassword } from '../shared/user.model';




@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers:[ContainerComponent]
})

export class NavbarComponent implements OnInit {
  userClaims:any = {};
  isAdmin:boolean = false;
  isLogOut = true;
  isLoggedIn: boolean;
  initialsUser: string;
  business: Array<any>;
  newpassword = new FormControl();
  objPassword: UpdatePassword = new UpdatePassword();


  @ViewChild('ChangePasswordModal') ChangePasswordModal;

  constructor(
    private container: ContainerComponent,
    private router: Router,
    private userService: UserService,
    public nav: NavbarService,
    private regionService: RegionService,
    public inactivityService: InactivityService,
    public toastr: ToastrService
  ) { }




  ngOnInit() {
    this.GetUserClaims();
//Submenu collapse
/*   $(document).on('click','.dropdown-submenu', function(e) {
      //e.preventDefault(); 
      //e.stopPropagation(); 
      //var test = $(this);
      // var menu = 
      $(this).closest('.dropdown').addClass('open');
     // menu.addClass('open');
      $(this).addClass('open');
      //submenu.toggleClass('open');
  
     }); */

     
    //Mobile view
    $("#wrapper").toggleClass("toggled");
    
    
    //Desktop view
   //$("#wrapper").removeClass("toggled");
    $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });

  
  }

  

  Logout() {
    localStorage.removeItem('userToken');
    this.router.navigate(['/login']);
    this.inactivityService.resetTimeOut();
    this.nav.hide();
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
    //this.business = this.userService.business;
  }

  


  GetUserClaims(): void{
    this.userService.getUserClaims().subscribe((data: any) => {
      this.userClaims = data;
      this.isAdmin = this.userService.isRoleAdmin(this.userClaims.RoleId);
      this.initialsUser = this.userClaims.FirstName.charAt(0) + this.userClaims.LastName.charAt(0);
      this.getAllBusiness(this.userClaims.UserName);
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


  updatePassword(password) {
      this.objPassword.UserName=this.userClaims.UserName;
      this.objPassword.Password= this.objPassword.Password.trim();
      this.userService.updatePassword(this.objPassword).subscribe(
        response => {
          //console.log(this.objPassword);
          this.toastr.success('Password Updated Correctly', 'Success!');
          this.ChangePasswordModal.hide();
         // localStorage.removeItem('userToken');
        },
        error => {
          console.log(error);
          this.showError();
        }
  );
   
  }

  resetFormChangePassword(form?: NgForm) {
    if (form != null)
      form.reset();
    this.objPassword = {
      Id: '',
      UserName: '',
      Password: '',
      NewPassword: '',
      ConfirmPassword: ''
    }
  }


  createFormControls() {
    this.newpassword = new FormControl('', [
      Validators.required,
      Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&.])[A-Za-z\d$@$!%*?&.].{8,}')
    ]);
  }
  
  showChangePasswordModal(): void {
    this.resetFormChangePassword();
    this.createFormControls();
    this.ChangePasswordModal.show();

  }

  showError() {
    this.toastr.error('Something went wrong. Please, contact support!', 'Oops!');
  }


}
