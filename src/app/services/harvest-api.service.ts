import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { flatMap, map, finalize } from 'rxjs/operators';
import { TimeEntry } from '@app/models/timeEntry.model';
import { resolveComponentResources } from '@angular/core/src/metadata/resource_loading';
import { TimeEntryResponse } from '@app/models/timeEntryResponse.model';
import { HarvestProfile } from '@app/models/harvestProfile.model';
import { AppSettingsService } from '@app/services/appSettings.service';

@Injectable({
  providedIn: 'root'
})
export class HarvestApiService {

  constructor(private http: HttpClient, private appSettings: AppSettingsService) { }

  public getProfile(): Observable<HarvestProfile> {
    return this.http.get<HarvestProfile>(`${this.appSettings.environment.harvestApi}/users/me.json`);
  }

  public getTimesheets(from: Date, to: Date, onlyApproved: boolean, progressSubject?: Subject<number>): Observable<TimeEntry[]> {
    if(progressSubject){
      progressSubject.next(0);
    }

    const entries = new Array<TimeEntry>();

    const getNextPack = (url: string | null): Observable<any> => {
      return url == null ? of(true) : this.http.get<TimeEntryResponse>(url).pipe(
        flatMap(res => {
          if(progressSubject){
            progressSubject.next(Math.floor(res.page / res.total_pages * 100));
          }
          entries.push(...res.time_entries);
          return getNextPack(res.links.next);
        })
      )
    }

    return this.getInitialTimesheetsFromApi(from.toISOString().split('T')[0], to.toISOString().split('T')[0], 1).pipe(
      flatMap(response => {
        entries.push(...response.time_entries);
        return getNextPack(response.links.next)
      }),
      map(() => entries.filter(e => !onlyApproved || (e.is_locked === onlyApproved)))
    )
  }

  private getInitialTimesheetsFromApi(from: string, to: string, page: number): Observable<TimeEntryResponse> {
    return this.http.get<TimeEntryResponse>(`${this.appSettings.environment.harvestApi}/time_entries`, {
      params: new HttpParams({
        fromObject: {
          from: from,
          to: to
        }
      })
    });
  }

}
