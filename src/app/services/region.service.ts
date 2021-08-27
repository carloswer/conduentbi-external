import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Region } from '../models/region';
import { Link } from '../models/link';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { PlatformLocation } from '@angular/common';
import * as connection from '../connection';

const httpOptions = {
    headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*'
        , 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE'
        , 'Content-Type': 'application/json'
    })
}


@Injectable()
export class RegionService {
    constructor(private http: HttpClient, platformLocation: PlatformLocation) { }

    private regionURL: string = connection.apiPath + '/api/Region/';

    private newLink: string;

    public getBusiness(userName: string): Observable<any> {
      //  return this.http.get<Array<Region>>(this.regionURL + "GetBusiness/" + userName, httpOptions)
      return this.http.get<Array<Region>>(this.regionURL + "GetBusiness/" + userName + "/", httpOptions)
 
            .pipe(
                tap(regions => regions),
                tap(_ => console.log(this.regionURL)),
                catchError(error => { return error })
               
            );
    }

    public getRegions(): Observable<any> {
        return this.http.get<Array<Region>>(this.regionURL + "GetRegions", httpOptions)
            .pipe(
                tap(regions => regions),
                catchError(error => { return error })
            );
    }

    public updateLink(selectedCountry: any): Observable<any> {
        var newLink: Link = { NewLink: selectedCountry.PowerBiLink }
        return this.http.post(this.regionURL + "updateLink" + `/${selectedCountry.Id}`, newLink, httpOptions).pipe(
            tap(_ => console.log('Country link updated - Country ID:' + selectedCountry.Id)),
            catchError(error => { return error })
        );
    }

    public getAllBusiness(): Observable<any> {
        return this.http.get<any>(this.regionURL + 'GetBusiness', httpOptions).pipe(
            tap(business => business),
            catchError(error => { return error })
        );
    }

    public getRegionsByBusinessID(businessID): Observable<any> {
        return this.http.get<any>(this.regionURL + 'GetRegionsByBusinessID/' + businessID, httpOptions).pipe(
            tap(regions => regions),
            catchError(error => { return error })
        );
    }

    public setLink(link: string): void {
        this.newLink = link;
    }

    public getLink(): string {
        return this.newLink;
    }

    public getRamosReport(): Observable<any> {
        return this.http.get(this.regionURL + 'GetReport', {responseType: 'blob'}).pipe(
            tap(report => report),
            catchError(error => { console.log(error); return error })
        );
    }

    public getToken(reportId:string):Observable<any>{
  
        //return this.http.get(this.regionURL + 'GetToken'+ `/${link}`, httpOptions);
        return this.http.post(this.regionURL + 'GetToken', {ReportId:reportId}, httpOptions);

    }

  
   


}