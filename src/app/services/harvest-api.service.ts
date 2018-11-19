import { ProjectAssignmentResponse, UserResponse } from './../models/harvestResponses.model';
import { ProjectAssignment } from '@app/models/project.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { flatMap, map, finalize } from 'rxjs/operators';
import { TimeEntry } from '@app/models/timeEntry.model';
import { resolveComponentResources } from '@angular/core/src/metadata/resource_loading';
import { TimeEntryResponse } from '@app/models/harvestResponses.model';
import { HarvestProfile } from '@app/models/harvestProfile.model';
import { AppSettingsService } from '@app/services/appSettings.service';
import { TaskAssignment } from '@app/models/task.model';
import { AuthService } from '@app/services/auth.service';
import { User } from '@app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class HarvestApiService {

  constructor(private auth: AuthService, private http: HttpClient, private appSettings: AppSettingsService) { }

  public getProfile(): Observable<HarvestProfile> {
    return this.http.get<HarvestProfile>(`${this.appSettings.environment.harvestApi}/users/me.json`);
  }

  public getTimesheets(userId: string | undefined, from: Date, to: Date, onlyApproved: boolean, progressSubject?: Subject<number>): Observable<TimeEntry[]> {
    if (progressSubject) {
      progressSubject.next(0);
    }

    const entries = new Array<TimeEntry>();

    const getNextPack = (url: string | null): Observable<any> => {
      return url == null ? of(true) : this.http.get<TimeEntryResponse>(url).pipe(
        flatMap(res => {
          if (progressSubject) {
            progressSubject.next(Math.floor(res.page / res.total_pages * 100));
          }
          entries.push(...res.time_entries);
          return getNextPack(res.links.next);
        })
      )
    }

    return this.getInitialTimesheetsFromApi(from.toISOString().split('T')[0], to.toISOString().split('T')[0], 1, userId).pipe(
      flatMap(response => {
        entries.push(...response.time_entries);
        return getNextPack(response.links.next)
      }),
      map(() => entries.filter(e => !onlyApproved || (e.is_locked === onlyApproved)))
    )
  }

  public createTimesheet(projectId: number, taskId: number, date: string, startTime: string, endTime: string, note: string): Observable<TimeEntry> {
    return this.http.post<TimeEntry>(`${this.appSettings.environment.harvestApi}/time_entries`, {
      project_id: projectId,
      task_id: taskId,
      spent_date: date,
      started_time: startTime,
      ended_time: endTime,
      notes: note
    });
  }

  public getProjectAssignments(): Observable<ProjectAssignment[]> {
    const entries = new Array<ProjectAssignment>();

    const getNextPack = (url: string | null): Observable<any> => {
      return url == null ? of(true) : this.http.get<ProjectAssignmentResponse>(url).pipe(
        flatMap(res => {
          entries.push(...res.project_assignments);
          return getNextPack(res.links.next);
        })
      )
    }

    return this.http.get<ProjectAssignmentResponse>(`${this.appSettings.environment.harvestApi}/users/me/project_assignments`).pipe(
      flatMap(response => {
        entries.push(...response.project_assignments);
        return getNextPack(response.links.next)
      }),
      map(() => entries)
    );
  }

  public getUsers(): Observable<User[]> {
    const entries = new Array<User>();

    const getNextPack = (url: string | null): Observable<any> => {
      return url == null ? of(true) : this.http.get<UserResponse>(url).pipe(
        flatMap(res => {
          entries.push(...res.users);
          return getNextPack(res.links.next);
        })
      )
    }
    return this.http.get<UserResponse>(`${this.appSettings.environment.harvestApi}/users`).pipe(
      flatMap(response => {
        entries.push(...response.users);
        return getNextPack(response.links.next)
      }),
      map(() => entries)
    );
  }

  private getInitialTimesheetsFromApi(from: string, to: string, page: number, userId: string | undefined): Observable<TimeEntryResponse> {
    let params = new HttpParams()
      .set("from", from)
      .set("to", to);
    if (userId) {
      params = params.set("user_id", userId);
    }
    return this.http.get<TimeEntryResponse>(`${this.appSettings.environment.harvestApi}/time_entries`, {
      params: params
    });
  }

}
