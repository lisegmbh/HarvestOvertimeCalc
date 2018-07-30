import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  public progressSubject = new Subject<number>();
  public showSpinner: boolean = false;
  public showDetails: boolean = false;

  constructor() { }
}
