import {compareCourses, Course} from '../model/course';
import {createEntityAdapter, EntityState} from '@ngrx/entity';
import {createReducer, on} from '@ngrx/store';
import {CourseActions} from '../action-types';


export interface CoursesState extends EntityState<Course> {
    allCoursesLoaded: boolean
}


export const adapter = createEntityAdapter<Course>({
    sortComparer: compareCourses
});


export const initialCoursesState = adapter.getInitialState({
    allCoursesLoaded:false
});


export const coursesReducer = createReducer(

    initialCoursesState,

    on(CourseActions.allCoursesLoaded,
        (state, action) => adapter.setAll( // gracias NgRx Entity, podemos actualizar todo el estado de los cursos con setAll, que reemplaza todos los cursos existentes con los nuevos cursos proporcionados en la acción. Esto es más eficiente y limpio que actualizar manualmente cada curso individualmente.
            action.courses,
            {...state,
                allCoursesLoaded:true
            })),


    on(CourseActions.courseUpdated, (state, action) =>
        adapter.updateOne(action.update, state) ) // gracias a NgRx Entity, podemos actualizar un curso específico en el estado utilizando updateOne, que toma un objeto de actualización (update) y actualiza solo el curso correspondiente en el estado. Esto es más eficiente que reemplazar todo el estado de los cursos.

);


export const {
    selectAll
} = adapter.getSelectors();

