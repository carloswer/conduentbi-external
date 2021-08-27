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
export class RegionCatalogService {
    constructor(private http: HttpClient) { }

    private apiPath: string = connection.apiPath + '/api/RegionCatalog/';

    public save(region: any): Observable<any> {
        return this.http.post<any>(this.apiPath + "Save", region, httpOptions)
            .pipe(
                tap(business => business),
                catchError(error => { return error })
            );
    }

    public update(id: number, newRegion: any): Observable<any> {
        return this.http.post(this.apiPath + "Update/" + id, newRegion, httpOptions).pipe(
            tap(region => region),
            catchError(error => { return error })
        );
    }

    public getAll(): Observable<any> {
        return this.http.get(this.apiPath + 'GetAll');
    }

    public getRegionById(id: number): Observable<any> {
        return this.http.get(this.apiPath + 'GetById/' + id).pipe(
            tap(region => region),
            catchError(error => { return error })
        )
    }

    public delete(id:number){
        return this.http.post(this.apiPath + "Delete/" + id, httpOptions).pipe(
            tap(region => region),
            catchError(error => {return error})
        )
    }
}