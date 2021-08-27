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
export class RoleService {
    constructor(private http: HttpClient) { }

    private apiPath: string = connection.apiPath + '/api/Role/';

    public save(role: any): Observable<any> {
        return this.http.post<any>(this.apiPath + "Save", role, httpOptions)
            .pipe(
                tap(role => role),
                catchError(error => { return error })
            );
    }

    public update(id: string, newRole: any): Observable<any> {
        return this.http.post(this.apiPath + "Update/" + id, newRole, httpOptions).pipe(
            tap(newRole => newRole),
            catchError(error => { return error })
        );
    }

    public getAll(): Observable<any> {
        return this.http.get(this.apiPath + 'GetAll');
    }

    public delete(id: string) {
        return this.http.post(this.apiPath + "Delete/" + id, httpOptions).pipe(
            tap(role => role),
            catchError(error => { return error })
        )
    }
}