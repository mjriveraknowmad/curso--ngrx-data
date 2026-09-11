import { Injectable } from "@angular/core";
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from "@ngrx/data";
import { Course } from "../model/course";

/**
 * Al extender EntityCollectionServiceBase,  y luego instanciar CourseEntityService, se obtiene automáticamente un conjunto de métodos para interactuar con la entidad Course,
 * como getAll(), getById(), add(), update(), delete(), loading$, loaded$, etc.  (courseEntityService.getAll() por ejemplo, devuelve un Observable<Course[]> con todos los cursos)
 * Esto simplifica la gestión de datos y reduce la cantidad de código necesario para manejar operaciones CRUD.
 *
 */
@Injectable()
export class CourseEntityService extends EntityCollectionServiceBase<Course> {

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    /**
     * EntityCollectionServiceElementsFactory es lo que proporciona los elementos necesarios para crear un servicio de colección de entidades.
     */
    super("Course", serviceElementsFactory);
  }

}
