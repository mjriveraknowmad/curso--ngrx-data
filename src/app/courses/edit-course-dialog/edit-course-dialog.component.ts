import {Component, inject, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Course} from '../model/course';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {CoursesHttpService} from '../services/courses-http.service';
import { Update } from '@ngrx/entity';
import { courseUpdated } from '../course.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../../reducers';

@Component({
    selector: 'course-dialog',
    templateUrl: './edit-course-dialog.component.html',
    styleUrls: ['./edit-course-dialog.component.css'],
    standalone: false
})
export class EditCourseDialogComponent {

  form?: FormGroup;

  dialogTitle: string;

  course: Course;

  mode: 'create' | 'update';

  loading$?:Observable<boolean>;

  store: Store<AppState> = inject(Store)

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditCourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private coursesService: CoursesHttpService) {

    this.dialogTitle = data.dialogTitle;
    this.course = data.course;
    this.mode = data.mode;

    const formControls = {
      description: ['', Validators.required],
      category: ['', Validators.required],
      longDescription: ['', Validators.required],
      promo: ['', []]
    };

    if (this.mode == 'update') {
      this.form = this.fb.group(formControls);
      this.form.patchValue({...data.course});
    }
    else if (this.mode == 'create') {
      this.form = this.fb.group({
        ...formControls,
        url: ['', Validators.required],
        iconUrl: ['', Validators.required]
      });
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onSave() {

    const course: Course = {
      ...this.course,
      ...this.form!.value
    };

    // el tipo a pasar a courseUpdated, es Update<Course>, que es un tipo genérico de NgRx Entity que representa una actualización parcial de una entidad.
    // Contiene el id de la entidad a actualizar y los cambios a aplicar. En este caso, estamos creando un objeto update que tiene el id del curso y los cambios del formulario, y luego lo pasamos a la acción courseUpdated para que el reducer pueda actualizar el estado de los cursos en el store.
    const update: Update<Course> = {
      id: course.id,
      changes: course
    };

    this.store.dispatch(courseUpdated({ update }));
    this.dialogRef.close();

    // this.coursesService.saveCourse(course.id, course)
    //   .subscribe(
    //     () => this.dialogRef.close()
    //   )



  }


}
