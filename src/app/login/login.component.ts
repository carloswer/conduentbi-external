import { Component, OnInit, TemplateRef, ViewContainerRef, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../shared/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NavbarService } from '../navbar.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, Validators, NgForm } from '@angular/forms';
import { UpdatePassword, ResetPassword } from '../shared/user.model';
import { RegionService } from '../services/region.service';
import { InactivityService } from "../services/inactivity.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoginError: boolean = false;

  userClaims: any = {};
 
  objPassword: ResetPassword = new ResetPassword();

  @ViewChild('ForgotPasswordModal') ForgotPasswordModal;
  @ViewChild('btnCloseEdit') btnCloseEdit: ElementRef;


  isFlipped: boolean = false;
  public business: Array<any>;
  public linkItems: Array<any>;
  public regions:Array<any>;
  mainPageLink:string;
  public powerBi: Array<any>;
  emailPattern = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$";
  //respuesta:{Error:null, Mensaje:""};
  respuesta: any = {};



  constructor(
    private userService: UserService,
    private router: Router,
    public nav: NavbarService,
    public toastr: ToastrService,
    private regionService: RegionService,
    public inactivityService: InactivityService
  
  ) {}


  Logout() {
    localStorage.removeItem('userToken');
    this.router.navigate(['/login']);
    this.nav.hide(); //ESCONDE EL NAVBAR
   
  }

  OnSubmit(email) {
    //this.isFlipped = !this.isFlipped;
    // this.userService.userAuthentication(userName.trim(), password.trim()).subscribe((data: any) => {
    //   localStorage.setItem('userToken', data.access_token);
    //   setTimeout(() => {
    //     //this.router.navigate(['/dashboard']);
    //     this.nav.show();
    //     this.getCurrentUser();
    //     this.inactivityService.startWatching();
      

    //   }, 1500);
    // },
    //   error => {
    //     this.isLoginError = true;
    //     this.isFlipped = !this.isFlipped;
    //     this.showError();
    //   });

      this.isFlipped = !this.isFlipped;
      this.userService.externalLogin(email.trim()).subscribe((data: any) => {
        localStorage.setItem('userToken', data.access_token);
        setTimeout(() => {
          //this.router.navigate(['/dashboard']);
          this.isFlipped = !this.isFlipped;
          this.nav.show();
          this.getCurrentUser();
          this.inactivityService.startWatching();
  
        }, 1500);
      },
        error => {
          console.log(error);
          this.isFlipped = !this.isFlipped;
          this.showError();          
        });
  }

  showError() {
    this.toastr.error('Incorrect username or password', 'ERROR');
  }

  forgotPassword(form: NgForm) {
      this.userService.resetPassword(this.objPassword).subscribe(
        (response: any) => {
          this.respuesta=response.Result;
          //console.log(this.respuesta);   
         if(!this.respuesta.Error){
                if (form != null){form.resetForm();}
          }
        },
        error => {
          this.respuesta = {
            Error: true,
            Message:"Something went wrong. Please, contact support."
          }

        }
      )
  }

  resetFormChangePassword() {
    this.objPassword = {
      Email: null
    }
    this.respuesta=null;
  }

  showForgotPasswordModal(): void {
    this.resetFormChangePassword();
    this.ForgotPasswordModal.show();
  }

  //VERIFICA SI YA EXISTE UN USUARIO LOGGEADO
  getCurrentUser() {
    this.userService.getUserClaims().subscribe((data: any) => {
      this.userClaims = data;
      this.getAllBusiness(this.userClaims.UserName);

    },
      error => {
        //console.log(error);
      }
    );
  }

  getMainPage() {
    if (this.business.length == 1) {
      this.regions = this.business.find(r => r.Name).Region;
      for (let i in this.regions) {
        let linkItems = this.regions[i].LinkItem;
        //Only 1 dashboard
        if (this.regions.length == 1 && linkItems.length == 1) {
          this.mainPageLink = linkItems[0].PowerBiLink;
          return this.mainPageLink;
        }
        for (let j in linkItems) {
          //Search "main page"
          if (linkItems[j].Name.includes("Main Page")) {
            this.mainPageLink = linkItems[j].PowerBiLink;
            return this.mainPageLink;
          }
        }
      }
    }
    return this.mainPageLink = null;
  }
  getAllBusiness(userName: string): void {
    this.regionService.getBusiness(userName)
      .subscribe(
        response => {
          this.business=response;
          this.getMainPage();
          if (this.mainPageLink != null){
            this.regionService.setLink(this.mainPageLink);
            this.router.navigate(['/powerBi']);
            }else{
            this.router.navigate(['/dashboard']);
          }
        },
        error => {
          console.log(error);
        }
      );
  }


  ngOnInit() {
  }

}
