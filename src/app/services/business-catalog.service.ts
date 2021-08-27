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
export class BusinessCatalogService {
    constructor(private http: HttpClient) { }

    private apiPath: string = connection.apiPath + '/api/Business/';

    public save(business: any): Observable<any> {
        return this.http.post<any>(this.apiPath + "Save", business, httpOptions)
            .pipe(
                tap(business => business),
                catchError(error => { return error })
            );
    }

    public update(id: number, newBusiness: any): Observable<any> {
        return this.http.post(this.apiPath + "Update/" + id, newBusiness, httpOptions).pipe(
            tap(business => business),
            catchError(error => { return error })
        );
    }

    public getAll(): Observable<any> {
        return this.http.get(this.apiPath + 'GetAll');
    }

    public getLinkById(id: number): Observable<any> {
        return this.http.get(this.apiPath + 'GetById/' + id).pipe(
            tap(business => business),
            catchError(error => { return error })
        )
    }

    public delete(id:number){
        return this.http.post(this.apiPath + "Delete/" + id, httpOptions).pipe(
            tap(business => business),
            catchError(error => {return error})
        )
    }
}