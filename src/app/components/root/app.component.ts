import { AuthService } from '@app/services/auth.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HarvestApiService } from '@app/services/harvest-api.service';
import { finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  public profile: any;


  constructor(private router: Router, public auth: AuthService) { }

  public ngOnInit(): void {
  }

  public ngAfterViewInit(): void {

  }

  public logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }


}
