import { Injectable, Injector } from "@angular/core";
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "@app/services/auth.service";
import { AppSettingsService } from "@app/services/appSettings.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService, private injector: Injector) { }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const appSettings: AppSettingsService = this.injector.get(AppSettingsService);
        if (appSettings.isInit() && request.url.includes("harvest")) {
            let headers = new HttpHeaders();
            if (this.auth.isAuth()) {
                headers = headers.set(`Authorization`, `Bearer ${this.auth.accessToken}`);
                headers = headers.set(`Harvest-Account-ID`, this.auth.userId);
            }
            const newRequest = request.clone({ headers: headers });

            return next.handle(newRequest);
        } else {
            return next.handle(request);
        }
    }
}