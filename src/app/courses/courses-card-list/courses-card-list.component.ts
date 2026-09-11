import {Component, EventEmitter, inject, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Course} from "../model/course";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {EditCourseDialogComponent} from "../edit-course-dialog/edit-course-dialog.component";
import {defaultDialogConfig} from '../shared/default-dialog-config';
import { CourseEntityService } from '../services/course-entity.service';

@Component({
    selector: 'courses-card-list',
    templateUrl: './courses-card-list.component.html',
    styleUrls: ['./courses-card-list.component.css'],
    standalone: false
})
export class CoursesCardListComponent implements OnInit {

    @Input()
    courses: Course[];

    @Output()
    courseChanged = new EventEmitter();
    coursesService = inject(CourseEntityService);

    constructor(
      private dialog: MatDialog ) {
    }

    ngOnInit() {

    }

    editCourse(course:Course) {

        const dialogConfig = defaultDialogConfig();

        dialogConfig.data = {
          dialogTitle:"Edit Course",
          course,
          mode: 'update'
        };

        this.dialog.open(EditCourseDialogComponent, dialogConfig)
          .afterClosed()
          .subscribe(() => this.courseChanged.emit());

    }

    onDeleteCourse(course:Course) {
      this.coursesService.delete(course); // siendo optimista por defecto, configurado en el entity metadata del courses module (optimisticUpdate: true).
    }

}









