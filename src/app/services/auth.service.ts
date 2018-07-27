import { HarvestProfile } from '@app/models/harvestProfile.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public profile: HarvestProfile
  constructor() { }

  public get userId(): string {
    const userId = localStorage.getItem("userId");
    if(!userId) {
      throw new Error("Token not availeble");
    }
    return userId;
  }

  public set userId(id: string) {
    localStorage.setItem("userId", id);
  }

  public get accessToken(): string {
    const token = localStorage.getItem("access_token");
    if(!token) {
      throw new Error("Token not availeble");
    }
    return token;
  }

  public set accessToken(token: string) {
    localStorage.setItem("access_token", token);
  }

  public logout(): void {
    localStorage.clear();
    this.profile = undefined;
  }

  public isAuth(): boolean {
    try {
      return this.accessToken != null && this.userId != null;
    } catch(e) {
      return false;
    }
  }
}
