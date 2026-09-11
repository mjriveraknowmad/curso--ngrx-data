import {Injectable} from '@angular/core';
import {DefaultDataService, HttpUrlGenerator} from '@ngrx/data';
import {Course} from '../model/course';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';


/**
 * Este servicio se encarga de manejar las operaciones de datos para los cursos utilizando NgRx Data.
 * Sobreescribe el método `getAll` de `DefaultDataService` para transformar la respuesta de la API antes de devolverla.
 * Y es útil sobre todo, cuando los datos devueltos por la API necesitan ser transformados antes de ser utilizados en la aplicación.
 */
@Injectable()
export class CoursesDataService extends DefaultDataService<Course> {


    constructor(http:HttpClient, httpUrlGenerator: HttpUrlGenerator) {
        super('Course', http, httpUrlGenerator);

    }

    getAll(): Observable<Course[]> {
        return this.http.get('/api/courses')
            .pipe(
                map(res => res["payload"])
            );
    }

}
