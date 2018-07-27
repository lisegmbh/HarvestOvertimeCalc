import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthHookComponent } from '@app/components/auth-hook/auth-hook.component';

describe('AuthHookComponent', () => {
  let component: AuthHookComponent;
  let fixture: ComponentFixture<AuthHookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthHookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthHookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
