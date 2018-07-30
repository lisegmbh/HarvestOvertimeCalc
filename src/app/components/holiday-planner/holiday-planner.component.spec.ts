import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayPlannerComponent } from '@app/components/holiday-planner/holiday-planner.component';

describe('HolidayPlannerComponent', () => {
  let component: HolidayPlannerComponent;
  let fixture: ComponentFixture<HolidayPlannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HolidayPlannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
