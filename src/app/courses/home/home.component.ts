import { Component, inject, OnInit } from "@angular/core";
import { compareCourses, Course } from "../model/course";
import { Observable } from "rxjs";
import { defaultDialogConfig } from "../shared/default-dialog-config";
import { EditCourseDialogComponent } from "../edit-course-dialog/edit-course-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { map, shareReplay, tap } from "rxjs/operators";
import { CoursesHttpService } from "../services/courses-http.service";
import { Store } from "@ngrx/store";
import { AppState } from "../../reducers";
import { CourseEntityService } from "../services/course-entity.service";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  standalone: false,
})
export class HomeComponent implements OnInit {
  coursesService = inject(CourseEntityService);
  promoTotal$?: Observable<number>;
  beginnerCourses$?: Observable<Course[]>;
  advancedCourses$?: Observable<Course[]>;

  constructor(
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.promoTotal$ = this.coursesService.entities$
        .pipe(
            map(courses => courses.filter(course => course.promo).length)
        );
    this.beginnerCourses$ = this.coursesService.entities$
      .pipe(
        map(courses => courses.filter(course => course.category == 'BEGINNER'))
      );
    this.advancedCourses$ = this.coursesService.entities$
      .pipe(
        map(courses => courses.filter(course => course.category == 'ADVANCED'))
      );
  }

  onAddCourse() {
    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle: "Create Course",
      mode: "create",
    };

    this.dialog.open(EditCourseDialogComponent, dialogConfig);
  }
}
