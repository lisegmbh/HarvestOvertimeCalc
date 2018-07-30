import { TaskAssignment } from '@app/models/task.model';
import { HarvestApiService } from '@app/services/harvest-api.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { map, concatMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { ProjectAssignment } from '@app/models/project.model';
import { from } from 'rxjs';

@Component({
  selector: 'app-holiday-planner',
  templateUrl: './holiday-planner.component.html',
  styleUrls: ['./holiday-planner.component.scss']
})
export class HolidayPlannerComponent implements OnInit {

  public projectAssignments: ProjectAssignment[];

  constructor(private auth: AuthService, private router: Router, private harvestApi: HarvestApiService) { }

  ngOnInit() {
    if (!this.auth.profile) {
      this.router.navigate([`/login`]);
    } else {
      this.harvestApi.getProjectAssignments()
        .pipe(
          map(taskAssignments => taskAssignments.sort((t1, t2) => {
            if (t1.project.name < t2.project.name) {
              return -1;
            } else if (t1.project.name > t2.project.name) {
              return 1;
            } else {
              return 0;
            }
          }))
        )
        .subscribe(sortedResult => {
          this.projectAssignments = sortedResult
        });
    }
  }

  public applyHoliday(form: NgForm): void {
    from(this.getDaysBetweenTwoDates(new Date(form.value.fromDate), new Date(form.value.toDate))).pipe(
      concatMap(date => this.harvestApi.createTimesheet(form.value.projectAssignment.project.id, form.value.taskAssignment.task.id, date, form.value.startTime, form.value.endTime, form.value.note))
    ).subscribe(
      result => {

      }, error => {
        alert("Error creating Entries");
      }, () => {
        alert("Holiday created");
      }
    )
  }

  private getDaysBetweenTwoDates(fromDate: Date, toDate: Date): string[] {
    const result = new Array<string>();
    let currentDate = fromDate;
    while (currentDate <= toDate) {
      result.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return result;
  }

}
