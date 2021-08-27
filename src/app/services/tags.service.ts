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
export class TagService {
    constructor(private http: HttpClient) { }

    private apiPath: string = connection.apiPath + '/api/Tag/';

    public save(tag: any): Observable<any> {
        return this.http.post<any>(this.apiPath + "Save", tag, httpOptions)
            .pipe(
                tap(tag => tag),
                catchError(error => { return error })
            );
    }

    public update(id: number, newTag: any): Observable<any> {
        return this.http.post(this.apiPath + "Update/" + id, newTag, httpOptions).pipe(
            tap(newTag => newTag),
            catchError(error => { return error })
        );
    }

    public getAll(): Observable<any> {
        return this.http.get(this.apiPath + 'GetAll');
    }

    public delete(id: number) {
        return this.http.post(this.apiPath + "Delete/" + id, httpOptions).pipe(
            tap(tag => tag),
            catchError(error => { return error })
        )
    }

    public search(searchText: string): Observable<any> {
        var text = {
            Text: searchText
        }
        return this.http.post(this.apiPath + 'GetInfoSearch', text, httpOptions).pipe(
            tap(text => text),
            catchError(error => { return error })
      );
    }
}
