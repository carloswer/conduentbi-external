import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavbarService } from './navbar.service';
import { UserService } from './shared/user.service';
import { RegionService } from './services/region.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isAdmin: any;
  isLoggedIn: boolean = false;
  
  constructor(public nav: NavbarService, private userService: UserService,
    private regionService: RegionService,
              private router: Router) {
  }

  showNav() {
    var user = localStorage.getItem('userToken');
    if(user != null){
      this.nav.show();
    }
  }

  get isLogin(): boolean {
    return this.router.url.indexOf('/login') !== -1;
  }

  // getAllBusiness(userName: string): void {
  //   this.regionService.getBusiness(userName)
  //     .subscribe(
  //       response => {
  //         this.userService.business = response;
  //       },
  //       error => {
  //         console.log(error);
  //       }
  //     );
  // }


  ngOnInit() {
    this.showNav();

  
    //this.getAllBusiness('martinezar');
  }
}
