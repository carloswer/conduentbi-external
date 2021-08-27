import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
    constructor(private router: Router) { }
    canActivate() {
        if (localStorage.getItem('userToken') != null && this.router.url != "/"){
            this.router.navigate([this.router.url])
        }
        else if(localStorage.getItem('userToken') != null && this.router.url == "/"){
            this.router.navigate(['/dashboard'])
        }
        return true;
    }
}
