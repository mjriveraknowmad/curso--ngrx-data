import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { AppState } from "../reducers";
import { select, Store } from "@ngrx/store";
import { filter, finalize, first, tap } from "rxjs/operators";
import { loadAllCourses } from "./course.actions";
import { areCoursesLoaded } from "./courses.selectors";

@Injectable()
export class CoursesResolver implements Resolve<any> {
  loading = false;

  constructor(private store: Store<AppState>) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<any> {
    return this.store.pipe(
      select(areCoursesLoaded), // Selecciona el estado de si los cursos están cargados o no desde el store
      tap((coursesLoaded) => {
        console.log("CoursesResolver: coursesLoaded =", coursesLoaded);
        if (!this.loading && !coursesLoaded) { // Si no se está cargando y los cursos no están cargados, se inicia la carga de cursos
          this.loading = true;
          this.store.dispatch(loadAllCourses()); // Despacha la acción para cargar todos los cursos
        }
      }),
      filter((coursesLoaded) => coursesLoaded), // Filtra el flujo de datos para continuar solo cuando los cursos estén cargados
      first(),
      finalize(() => (this.loading = false)),
    );
  }
}
