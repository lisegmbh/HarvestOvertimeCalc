import { Injectable, Injector } from "@angular/core";
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "@app/services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService) { }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let headers = new HttpHeaders();
        if (this.auth.isAuth()) {
            headers = headers.set(`Authorization`, `Bearer ${this.auth.accessToken}`);
            headers = headers.set(`Harvest-Account-ID`, this.auth.userId);
        }
        const newRequest = request.clone({ headers: headers });

        return next.handle(newRequest);
    }
}