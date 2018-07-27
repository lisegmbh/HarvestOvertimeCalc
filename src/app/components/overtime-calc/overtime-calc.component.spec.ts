import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertimeCalcComponent } from '@app/components/overtime-calc/overtime-calc.component';

describe('OvertimeCalcComponent', () => {
  let component: OvertimeCalcComponent;
  let fixture: ComponentFixture<OvertimeCalcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OvertimeCalcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvertimeCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
