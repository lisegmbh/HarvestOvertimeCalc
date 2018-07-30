import { TaskAssignment } from '@app/models/task.model';
import { HarvestApiService } from '@app/services/harvest-api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { map, concatMap, distinct, mergeMap, reduce, filter, concatAll, toArray, flatMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { ProjectAssignment } from '@app/models/project.model';
import { from, Observable, of } from 'rxjs';
import { SpinnerService } from '@app/services/spinner.service';
import * as Holidays from 'date-holidays';

@Component({
  selector: 'app-holiday-planner',
  templateUrl: './holiday-planner.component.html',
  styleUrls: ['./holiday-planner.component.scss']
})
export class HolidayPlannerComponent implements OnInit {
  @ViewChild('form')
  public form: NgForm;

  public projectAssignments: ProjectAssignment[];
  public countryList: Array<{ code: string, name: string }> = new Array();

  constructor(private auth: AuthService, private router: Router, private harvestApi: HarvestApiService, private spinnerService: SpinnerService) { }

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
          this.projectAssignments = sortedResult;
          this.initCountryList();
          this.form.setValue({
            fromDate: new Date().toISOString().split("T")[0],
            toDate: new Date().toISOString().split("T")[0],
            startTime: "10:00",
            endTime: "18:00",
            weekDays: [1, 2, 3, 4, 5],
            note: "Vacation",
            projectAssignment: sortedResult.length ? sortedResult[0] : null,
            taskAssignment: sortedResult.length ? sortedResult[0].task_assignments[0] : null,
            handlePublicHolidays: true,
            countryCode: "DE",
            publicHolidayProjectAssignment: sortedResult.length ? sortedResult[0] : null,
            publicHolidayTaskAssignment: sortedResult.length ? sortedResult[0].task_assignments[0] : null,
          });
        });
    }
  }

  public applyHoliday(form: NgForm): void {
    this.spinnerService.showSpinner = true;
    const fromDate = new Date(form.value.fromDate);
    const toDate = new Date(form.value.toDate);
    const countryCode: string = form.value.countryCode;
    const handlePublicHolidays: boolean = form.value.handlePublicHolidays;

    const holidayService = new Holidays(countryCode);
    const daysToCreate = this.getDaysBetweenTwoDates(fromDate, toDate, form.value.weekDays);
    from(daysToCreate).pipe(
      concatMap((date, idx) => {
        this.spinnerService.progressSubject.next(Math.floor((idx + 1) / daysToCreate.length) * 100);
        const holiday = holidayService.isHoliday(date);
        if (handlePublicHolidays && holiday && holiday.type === "public") {
          return this.harvestApi.createTimesheet(form.value.publicHolidayProjectAssignment.project.id, form.value.publicHolidayTaskAssignment.task.id, date.toISOString().split("T")[0], form.value.startTime, form.value.endTime, holiday.name)
        } else {
          return this.harvestApi.createTimesheet(form.value.projectAssignment.project.id, form.value.taskAssignment.task.id, date.toISOString().split("T")[0], form.value.startTime, form.value.endTime, form.value.note)
        }
      })
    ).subscribe(
      result => {

      }, error => {
        alert("Error creating Entries");
      }, () => {
        this.spinnerService.showSpinner = false;
      }
    )
  }

  private getDaysBetweenTwoDates(fromDate: Date, toDate: Date, allowedWeekDays: number[]): Date[] {
    const result = new Array<Date>();
    let currentDate = fromDate;
    while (currentDate <= toDate) {
      if (allowedWeekDays.includes(currentDate.getDay())) {
        result.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return result;
  }

  private initCountryList(): void {
    const holidayService = new Holidays();
    this.countryList = Object.entries(holidayService.getCountries())
      .map(([code, name]) => {
        return {
          code: code,
          name: name as string
        }
      })
  }

}
