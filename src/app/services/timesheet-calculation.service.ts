import { Injectable } from '@angular/core';
import { TimesheetCalculationResult } from '@app/models/timesheetCalculationResult.model';
import { TimeEntry } from '@app/models/timeEntry.model';

@Injectable({
  providedIn: 'root'
})
export class TimesheetCalculation {

  constructor() { }

  public calculateResult(hoursPerWeek: number, sheets: TimeEntry[], from: Date, to: Date): TimesheetCalculationResult {
    const result = new TimesheetCalculationResult();
    result.neededHoursPerDay = hoursPerWeek / 5;
    result.totalWorkingTime = sheets.reduce((acc, sheet) => acc + sheet.hours, 0);
    result.amountOfWorkingDays = this.getAmountOfWorkingDays(new Date(from), new Date(to));
    result.neededHours = result.amountOfWorkingDays * result.neededHoursPerDay;
    result.overtime = (result.totalWorkingTime - result.neededHours);
    return result;
  }

  public getAmountOfWorkingDays(startDate: Date, endDate: Date) {
    let numWorkDays = 0;
    const currentDate = startDate;
    while (currentDate <= endDate) {
      // Skips Sunday and Saturday
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        numWorkDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return numWorkDays;
  }
}
