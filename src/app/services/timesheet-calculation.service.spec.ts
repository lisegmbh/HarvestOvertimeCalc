import { TestBed, inject } from '@angular/core/testing';

import { TimesheetCalculation } from '@app/services/timesheet-calculation.service';
import { TimeEntry } from '@app/models/timeEntry.model';

describe('TimesheetCalculationServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimesheetCalculation]
    });
  });

  it('should be created', inject([TimesheetCalculation], (service: TimesheetCalculation) => {
    expect(service).toBeTruthy();
  }));
  it('should return something', inject([TimesheetCalculation], (service: TimesheetCalculation) => {
    expect(service.calculateResult(0, [], new Date(), new Date())).toBeDefined();
  }));
  it('amount of working days for one week should be 5', inject([TimesheetCalculation], (service: TimesheetCalculation) => {
    expect(service.getAmountOfWorkingDays(new Date('2018-01-01'), new Date('2018-01-07'))).toEqual(5);
  }));
  it('given workedHours equals expectedHours overtime should be 0', inject([TimesheetCalculation], (service: TimesheetCalculation) => {
    // Arrange
    const workedHours: number = 40;
    const timeEntries: TimeEntry[] = [{hours: workedHours}];

    // Act
    const result = service.calculateResult(workedHours, timeEntries, new Date('2018-01-01'), new Date('2018-01-07'));

    // Assert
    expect(result.overtime).toEqual(0);
  }));
});
