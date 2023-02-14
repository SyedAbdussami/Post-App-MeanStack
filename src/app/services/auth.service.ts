import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { User } from "../models/auth-data.component";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { timeout } from "rxjs/operators";


import{environment} from '../../environments/environment';

const BACKEND_URL=environment.apiUrl+"/user/";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  getToken() {
    return this.token;
  }

  getAuthStatus() {
    return this.isAuthenticated;
  }
  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const user: User = { email: email, password: password };
    this.http
      .post(BACKEND_URL+"signup", user)
      .subscribe(()=>{
        this.router.navigate(["/"]);
      },error=>{
        this.authStatusListener.next(false);
      });
  }
  loginUser(email: string, password: string) {
    const user: User = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
       BACKEND_URL+"login",
        user
      )
      .subscribe(res => {
        console.log(res);
        const token = res.token;
        this.token = token;
        const expiresDuration = res.expiresIn;
        if (token) {
          this.authStatusListener.next(true);
          this.isAuthenticated = true;
          this.userId = res.userId;
          this.setAuthTimer(expiresDuration);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresDuration * 1000
          );
          console.log(expirationDate);
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(["/"]);
        }
      },error=>{
        this.authStatusListener.next(false);
      });
  }

  setAuthTimer(duration) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(["/login"]);
    this.userId = null;
    clearTimeout(this.tokenTimer);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }
  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }
}
