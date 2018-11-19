import { CanActivate } from "@angular/router/src/utils/preactivation";
import { Injectable } from "@angular/core";
import { AuthService } from "@app/services/auth.service";
import { ActivatedRouteSnapshot, Router } from "@angular/router";

@Injectable()
export class OvertimeGuard implements CanActivate {
    path: ActivatedRouteSnapshot[];
    route: ActivatedRouteSnapshot;
    constructor(private auth: AuthService, private router: Router){}
    public canActivate(route: ActivatedRouteSnapshot[], state: ActivatedRouteSnapshot): Promise<boolean> {
        var profileLoaded = this.auth.profile != null;
        if(profileLoaded){
            return Promise.resolve(true);
        }
        this.router.navigate([`/login`]);
        return Promise.resolve(false);
    }

}