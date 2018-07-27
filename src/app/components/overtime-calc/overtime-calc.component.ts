import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HarvestApiService } from '@app/services/harvest-api.service';
import { AuthService } from '@app/services/auth.service';
import { TimeEntry } from '@app/models/timeEntry.model';
import { TimesheetCalculationResult } from '@app/models/timesheetCalculationResult.model';
import { TimesheetCalculation } from '@app/services/timesheet-calculation.service';

@Component({
  selector: 'app-overtime-calc',
  templateUrl: './overtime-calc.component.html',
  styleUrls: ['./overtime-calc.component.scss']
})
export class OvertimeCalcComponent implements OnInit, AfterViewInit {

  @ViewChild('form')
  public form: NgForm;
  public result: TimesheetCalculationResult = new TimesheetCalculationResult();
  public progressSubject = new Subject<number>();
  public showSpinner: boolean = false;
  public showDetails: boolean = false;

  constructor(public auth: AuthService,
    private harvestApi: HarvestApiService,
    private router: Router,
    private timesheetCalculation: TimesheetCalculation) { }

  public ngOnInit() {
    if (!this.auth.profile) {
      this.router.navigate([`/login`]);
    }
  }

  public ngAfterViewInit(): void {
    setTimeout(() =>
    this.form.setValue({
      to: new Date().toISOString().split('T')[0],
      from: new Date(this.auth.profile.created_at).toISOString().split('T')[0],
      hoursPerWeek: 40
    })
  );
  }

  public getOvertime(form: NgForm): void {
    this.showSpinner = true;

    const from = new Date(form.value.from);
    const to = new Date(form.value.to);

    this.harvestApi.getTimesheets(from, to, this.progressSubject).pipe(
      finalize(() => this.showSpinner = false)
    ).subscribe(sheets => {
      this.result = this.timesheetCalculation.calculateResult(form.value.hoursPerWeek, sheets, from, to);
    });
  }
}
