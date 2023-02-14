import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService:AuthService){
  }
  ngOnInit(){
    this.authService.autoAuthUser();
  }
  // storedPosts=[];
  // onPostAdded(post){
  //   this.storedPosts.push(post);
  // }


}
