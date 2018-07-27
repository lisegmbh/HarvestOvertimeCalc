import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { HarvestApiService } from '@app/services/harvest-api.service';

@Component({
  selector: 'app-auth-hook',
  templateUrl: './auth-hook.component.html',
  styleUrls: ['./auth-hook.component.scss']
})
export class AuthHookComponent implements OnInit {

  constructor(private harvestApi: HarvestApiService, private router: Router, private auth: AuthService, private route: ActivatedRoute) { }

  public ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        console.log(params)
        this.auth.accessToken = params.access_token;
        console.log(params.scope.split[":"])
        this.auth.userId = params.scope.split(":")[1];
        this.harvestApi.getProfile()
        .subscribe(profile => {
          this.auth.profile = profile;
          this.router.navigate(['/overtime']);
        }, () => alert(`Error`));
      });
  }

}
