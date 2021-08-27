import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Response } from "@angular/http";
import { Observable } from 'rxjs';

import { User, DeleteUser } from './user.model';
import { Account } from '../models/account';
import {PlatformLocation } from '@angular/common';
import * as connection from '../connection';
import { NavbarService } from '../navbar.service';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
      , 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE'
      , 'Content-Type': 'application/json'
  })
}

@Injectable()
export class UserService {
  isLoggedIn:boolean = false;
  constructor(
    private http: HttpClient, 
    platformLocation: PlatformLocation,
    public nav: NavbarService,
    private router: Router
    ) {}

  private rootUrl: string = connection.apiPath;

  registerUser(user: User) {
    const body: User = {
      Id: user.Id,
      UserName: user.UserName,
      Password: user.Password,
      Email: user.Email,
      FirstName: user.FirstName,
      LastName: user.LastName,
      RoleID: user.RoleID,
      BusinessList: user.BusinessList,
      RoleList: user.RoleList,
      Business: user.Business,
      RegionList:user.RegionList,
      WinId: user.WinId,
      ExternalAccess: user.ExternalAccess
    }

    
    //var reqHeader = new HttpHeaders({'No-Auth':'True'});
    return this.http.post(this.rootUrl + '/api/User/Register', body, httpOptions);
  }

  userAuthentication(userName, password) {
    var data = "username=" + userName + "&password=" + password + "&grant_type=password";
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded','No-Auth':'True' });
    return this.http.post(this.rootUrl + '/token', data, { headers: reqHeader });
  }

  externalLogin(email){
    var data = { Email: email};
    return this.http.post(this.rootUrl + '/api/Account/ExternalLogin', data);
  }

  getUserClaims(): Observable<any>{
   return this.http.get(this.rootUrl+'/api/GetUserClaims');
  }

  deleteUser(id){
    var user = new DeleteUser();
    user.Id = id;
    return this.http.post(this.rootUrl+'/api/DeleteUser', user);
  }

  updateUser(id:string, user:any){
    return this.http.post(this.rootUrl + '/api/User/Update/' + id, user, httpOptions);
  }

  updatePassword(user:any): Observable<any>{
    return this.http.post(this.rootUrl + '/api/User/UpdatePassword', user, httpOptions);
  }

  getUsers(): Observable<any>{
    return this.http.get(this.rootUrl+'/api/GetUsers');
  }

  getRoles(): Observable<any>{
    return this.http.get(this.rootUrl+'/api/GetRoles');
  }

  /*isRoleAdmin(roleId: string):boolean{
    if(roleId === "fafbc953-f8a2-412c-98da-2c102aa348a7"){
      return true;
    }
    else{
      return false;
    }
  }*/

  isRoleAdmin(roleId: any):boolean{
    if(roleId.includes("fafbc953-f8a2-412c-98da-2c102aa348a7")){
      return true;
    }
    else{
      return false;
    }
  }

  setLogged(value){
    this.isLoggedIn = value;
  }

  getLogged(){
    return this.isLoggedIn;
  }

  logout(){
    localStorage.removeItem('userToken');
    this.router.navigate(['/login']);
    this.nav.hide();
  }

  resetPassword(email:any){
    return this.http.post(this.rootUrl + '/api/User/ForgotPassword', email, httpOptions);
  }

}
