import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HarvestApiService } from '@app/services/harvest-api.service';
import { AuthService } from '@app/services/auth.service';
import { TimeEntry } from '@app/models/timeEntry.model';
import { TimesheetCalculationResult } from '@app/models/timesheetCalculationResult.model';
import { TimesheetCalculation } from '@app/services/timesheet-calculation.service';
import { SpinnerService } from '@app/services/spinner.service';
import { User } from '@app/models/user.model';

@Component({
  selector: 'app-overtime-calc',
  templateUrl: './overtime-calc.component.html',
  styleUrls: ['./overtime-calc.component.scss']
})
export class OvertimeCalcComponent implements OnInit, AfterViewInit {

  @ViewChild('form')
  public form: NgForm;
  public result: TimesheetCalculationResult = new TimesheetCalculationResult();
  public showDetails: boolean = false;
  public usersObservable: Observable<User[]>;

  public get isAdmin(): boolean {
    return this.auth.profile.is_admin;
  }

  constructor(public auth: AuthService,
    private harvestApi: HarvestApiService,
    private router: Router,
    private timesheetCalculation: TimesheetCalculation,
    private spinnerService: SpinnerService) { }

  public ngOnInit() {
    this.usersObservable = this.harvestApi.getUsers();
  }

  public ngAfterViewInit(): void {
    setTimeout(() =>
      this.form.setValue({
        to: new Date().toISOString().split('T')[0],
        from: new Date(this.auth.profile.created_at).toISOString().split('T')[0],
        hoursPerWeek: 40,
        onlyApproved: false,
        user: null
      })
    );
  }

  public onSelectUser(user: User): void {
    if (user != null) {
      this.form.controls.from.setValue(new Date(user.created_at).toISOString().split('T')[0]);
    }
  }

  public getOvertime(form: NgForm): void {
    this.spinnerService.showSpinner = true;

    const from = new Date(form.value.from);
    const to = new Date(form.value.to);
    const user = form.value.user as User | undefined;

    const userId = (() => {
      if (this.auth.profile.is_admin) {
        return user.id.toString();
      } else if (this.auth.profile.is_project_manager) {
        return this.auth.profile.id.toString();
      } else {
        return undefined;
      }
    })()
    this.harvestApi.getTimesheets(userId, from, to, form.value.onlyApproved, this.spinnerService.progressSubject).pipe(
      finalize(() => this.spinnerService.showSpinner = false)
    ).subscribe(sheets => {
      this.result = this.timesheetCalculation.calculateResult(form.value.hoursPerWeek, sheets, from, to);
    });
  }
}
