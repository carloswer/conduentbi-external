import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from "../shared/user.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    var token = localStorage.getItem('userToken');
    if (token && state.url !== '/login') {
      this.userService.getUserClaims().subscribe((data: any) => {
        var allowedRole = next.data.role;
        if (allowedRole !== undefined) {
          //if (allowedRole.indexOf(data.Role) === -1) {
          if (allowedRole.some(r=> data.Role.includes(r))) {
              return true;
          }
          else {
            this.router.navigate(['/dashboard']);
            return false;
          }
        }
      },
        error => {
          this.router.navigate(['/login']);
          return false;
        }
      );
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
