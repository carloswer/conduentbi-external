import { Tag } from './../models/tag';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as connection from '../connection';

const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*'
    , 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    , 'Content-Type': 'application/json'
  })
}

@Injectable()
export class LinkService {
  constructor(private http: HttpClient) { }

  private linkURL: string = connection.apiPath + '/api/ItemLink/';
  private tagURL: string = connection.apiPath + '/api/Tag/';
  private searchUrl: string = connection.apiPath + '/api/Search/'

  public saveLink(link: any): Observable<any> {
    return this.http.post<any>(this.linkURL + "Save", link, httpOptions)
      .pipe(
        tap(link => link),
        catchError(error => { return error })
      );
  }

  public updateLink(id: number, newLink: any): Observable<any> {
    return this.http.post(this.linkURL + "Update/" + id, newLink, httpOptions).pipe(
      tap(link => link),
      catchError(error => { return error })
    );
  }

  /*public updateDetails(id: number, newLink: any): Observable<any> {
    return this.http.post(this.linkURL + "UpdateDetails/" + id, newLink, httpOptions).pipe(
      tap(link => link),
      catchError(error => { return error })
    );
  }*/

  public getLinks(): Observable<any> {
    return this.http.get(this.linkURL + 'GetAll');
  }

  public getLinkById(id: number): Observable<any> {
    return this.http.get(this.linkURL + 'GetById/' + id).pipe(
      tap(link => link),
      catchError(error => { return error })
    );
  }

  public delete(id: number) {
    return this.http.post(this.linkURL + "Delete/" + id, httpOptions).pipe(
      tap(link => link),
      catchError(error => { return error })
    );
  }

  public getTagAvailable(id: number): Observable<any> {
    return this.http.get(this.tagURL + 'GetAvailability/' + id).pipe(
      tap(link => link),
      catchError(error => { return error })
    );
  }

  public manageTags(id: number, tags: Array<Tag>): Observable<any> {
    return this.http.post(this.tagURL + "ManageTags/" + id, tags, httpOptions).pipe(
      tap(tag => tag),
      catchError(error => { return error })
    );
  }

  public searchLink(parameter: string): Observable<any> {
    return this.http.get(this.searchUrl + 'SearchLink/' + parameter, httpOptions).pipe(
      tap(link => link),
      catchError(error => { return error })
    );
  }
}
