import { HarvestApiService } from '@app/services/harvest-api.service';
import { AuthService } from '@app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettingsService } from '@app/services/appSettings.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginMethod: string = "credentials";

  constructor(private appSettings: AppSettingsService, private auth: AuthService, private harvestApi: HarvestApiService, private router: Router) { }

  ngOnInit() {
    if(this.auth.isAuth()){
      this.getProfile();
    }
  }

  public redirectToHarvest(): void {
    window.open(`https://id.getharvest.com/oauth2/authorize?client_id=${this.appSettings.environment.oAuthClientId}&response_type=token`);
  }

  public setPersonalToken(token: string, userId: string): void {
    this.auth.accessToken = token;
    this.auth.userId = userId;
    this.getProfile();
  }

  private getProfile(): void {
    this.harvestApi.getProfile()
    .subscribe(profile => {
      this.auth.profile = profile;
      this.router.navigate(['/overtime']);
    }, () => {
      alert(`Error loading Profile`)
      this.auth.logout();
    });
  }

}
