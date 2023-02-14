import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ErrorComponent } from "../components/error/error.component";
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(public dialog: MatDialog) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        let err = "An unkown error occured";
        if (error.error.message) {
          err = error.error.message;
        }
        // alert(error.error.error._message);
        this.dialog.open(ErrorComponent, {data: { message: err }});
        return throwError(error);
      })
    );
  }
}
