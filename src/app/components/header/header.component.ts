import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {
  private authListenerStatus:Subscription;
   userIsAuthenticated=false;
     constructor(public authService:AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated=this.authService.getAuthStatus();
    this.authListenerStatus=this.authService.getAuthStatusListener().subscribe(
      isAuthenticated=>{
        this.userIsAuthenticated=isAuthenticated;
      }
    );
  }

  ngOnDestroy(){
    this.authListenerStatus.unsubscribe();

  }
  onLogout(){
    this.authService.logout();
  }

}
