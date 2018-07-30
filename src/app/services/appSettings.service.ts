import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Environment } from '@app/models/environment.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {

  private env: Environment;

  constructor(private http: HttpClient) { }

  public get environment(): Environment {
    if(!this.env){
      throw new Error("Environment not initialized yet");
    }
    return this.env;
  }

  public isInit(): boolean {
    return this.env != null;
  }

  public initialize(): Observable<boolean> {
    return this.http.get<Environment>(`/env.json`).pipe(
      map(result => {
        this.env = result;
        return result.production;
      })
    );
  }
}
