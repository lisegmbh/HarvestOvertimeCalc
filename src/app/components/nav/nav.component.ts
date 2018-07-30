import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { SpinnerService } from '@app/services/spinner.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(private router: Router, public auth: AuthService, public spinnerService: SpinnerService) { }

  public ngOnInit(): void {
  }

  public ngAfterViewInit(): void {

  }

  public logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

}
