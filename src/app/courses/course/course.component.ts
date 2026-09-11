import {AfterViewInit, Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {Observable} from 'rxjs';
import {Lesson} from '../model/lesson';
import {concatMap, delay, filter, first, map, shareReplay, tap, withLatestFrom} from 'rxjs/operators';
import {CoursesHttpService} from '../services/courses-http.service';
import { CourseEntityService } from '../services/course-entity.service';
import { LessonEntityService } from '../services/lesson-entity.service';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css'],
    standalone: false
})
export class CourseComponent implements OnInit {

  course$?: Observable<Course>;
  lessons$?: Observable<Lesson[]>;
  loading$?: Observable<boolean>;

  displayedColumns = ['seqNo', 'description', 'duration'];

  nextPage = 0;

  coursesService = inject(CourseEntityService);
  lessonsService = inject(LessonEntityService);

  constructor(
    private route: ActivatedRoute) {

  }

  ngOnInit() {

    const courseUrl = this.route.snapshot.paramMap.get("courseUrl");

    // this.course$ = this.coursesService.findCourseByUrl(courseUrl);
    this.course$ = this.coursesService.entities$.pipe(
      map(courses => courses.find(course => course.url === courseUrl)),
      filter(course => !!course)
    );

    // this.lessons$ = this.course$.pipe(
    //   concatMap(course => this.coursesService.findLessons(course.id)),
    //   tap(console.log)
    // );


    this.lessons$ = this.lessonsService.entities$
      .pipe(
        withLatestFrom(this.course$),         // Cada vez que las lecciones cambian, toma el valor MÁS RECIENTE del curso
        tap(([lessons, course]) => {  // tenemos acceso a las lecciones (de los.entities$) y al curso más reciente (del course$)
            if (this.nextPage == 0) {         //En la primera carga (nextPage == 0), carga la primera página de lecciones del curso
                this.loadLessonsPage(course); // en el caso del resto de las páginas, se cargan de manera incremental, cada vez que se pulse sobre el botón "Load More", en el html, ya que llama a loadLessonsPage(course)
            }
        }),
        map(([lessons, course]) =>
            lessons.filter(lesson => lesson.courseId == course.id)), //Filtra las lecciones para devolver solo las que pertenecen al curso actual
        tap(filteredLessons => console.log('Filtered Lessons:', filteredLessons))
      );

    this.loading$ = this.lessonsService.loading$.pipe(delay(0));

  }


  loadLessonsPage(course: Course) {
    // Esto hace que se cargue la siguiente página
    // haciendo que pase de nuevo por this.lessons$ = this.lessonsService.entities$
    // puesto más arriba en el flujo de datos
    this.lessonsService.getWithQuery({
      'courseId': course.id.toString(),
      'pageNumber': this.nextPage.toString(),
      'pageSize': '3'
    });

    this.nextPage += 1;
  }

}
