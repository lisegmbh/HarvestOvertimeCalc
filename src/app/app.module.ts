import { AuthHookComponent } from '@app/components/auth-hook/auth-hook.component';
import { OvertimeCalcComponent } from '@app/components/overtime-calc/overtime-calc.component';
import { LoginComponent } from '@app/components/login/login.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { enableProdMode } from '@angular/core';

import { AppComponent } from '@app/components/root/app.component';
import { AuthInterceptor } from '@app/utils/auth.interceptor';
import { AppSettingsService } from '@app/services/appSettings.service';
import { tap } from 'rxjs/operators';
import { HolidayPlannerComponent } from '@app/components/holiday-planner/holiday-planner.component';
import { NavComponent } from './components/nav/nav.component';
import { OvertimeGuard } from '@app/guards/overtime.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'authHook', component: AuthHookComponent },
  { path: 'overtime', component: OvertimeCalcComponent, canActivate: [OvertimeGuard] },
  { path: 'holidayPlanner', component: HolidayPlannerComponent }
];

export function loadEnvironment(appSettings: AppSettingsService): () => Promise<any> {
  return (): Promise<any> => {
    return appSettings.initialize().toPromise();
  }
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AuthHookComponent,
    OvertimeCalcComponent,
    HolidayPlannerComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      routes
    )
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: loadEnvironment,
      multi: true,
      deps: [AppSettingsService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    OvertimeGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
