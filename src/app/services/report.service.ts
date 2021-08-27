import { Injectable } from '@angular/core';
import * as connection from '../connection';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';



const httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
      , 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE'
      , 'Content-Type': 'application/json'
    })
  }
  

@Injectable()
export class ReportService {
  constructor(private http: HttpClient) { }
  private apiPath: string = connection.apiPath + '/api/Report/';



//Catalogs
public getYears(): Observable<any> {
  return this.http.get(this.apiPath + 'GetYears');
}
public getQuarters(): Observable<any> {
  return this.http.get(this.apiPath + 'GetQuarters');
}
public getMonths(): Observable<any> {
  return this.http.get(this.apiPath + 'GetMonths');
}
public getReportTypes(): Observable<any> {
  return this.http.get(this.apiPath + 'GetReportTypes');
}
public getRegions(): Observable<any> {
  return this.http.get(this.apiPath + 'GetRegions');
}
public getSubRegions(): Observable<any> {
  return this.http.get(this.apiPath + 'GetSubRegions');
}
public getRequestStatus(): Observable<any> {
  return this.http.get(this.apiPath + 'GetRequestStatus');
}
public getAddressables(): Observable<any> {
  return this.http.get(this.apiPath + 'GetAddressables');
}
public getProductTypes(): Observable<any> {
  return this.http.get(this.apiPath + 'GetProductTypes');
}
public getSavingMethodologies(): Observable<any> {
  return this.http.get(this.apiPath + 'GetSavingMethodologies');
}

public extractFlatFile(filters:any) {
return this.http.post(this.apiPath + "GetFlatFile",filters,  { responseType: 'arraybuffer' });
}

}
