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
import { selectAdvancedCourses, selectAllCourses, selectBeginnerCourses, selectPromoTotal } from "../courses.selectors";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
  standalone: false,
})
export class HomeComponent implements OnInit {
  store = inject(Store<AppState>);
  courses$ = this.store.select(selectAllCourses).pipe(
    map((entities) => (Object.values(entities) || []).sort(compareCourses)),
    shareReplay(), // Sino se usara shareReplay, cada vez que se suscriba un observable, se haría una nueva petición HTTP (en este caso 4 veces, por: loading, beginnerCourses, advancedCourses, promoTotal)
  );
  promoTotal$?: Observable<number>;
  beginnerCourses$?: Observable<Course[]>;
  advancedCourses$?: Observable<Course[]>;

  constructor(
    private dialog: MatDialog,
    private coursesHttpService: CoursesHttpService,
  ) {}

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.courses$ = this.store.select(selectAllCourses);
    this.promoTotal$ = this.store.select(selectPromoTotal);
    this.beginnerCourses$ = this.store.select(selectBeginnerCourses);
    this.advancedCourses$ = this.store.select(selectAdvancedCourses);
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
