import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule,Routes} from '@angular/router';
import { PostListComponent } from '../components/post-list/post-list.component';
import { PostsCreateComponent } from '../components/posts-create/posts-create.component';
import { LoginComponent } from '../components/login/login.component';
import { SignupComponent } from '../components/signup/signup.component';
import { AuthGuard } from '../services/auth-guard';

const router:Routes=[
  {path:'',component:PostListComponent},
  {path:'create',component:PostsCreateComponent,canActivate:[AuthGuard]},
  {path:'edit/:postId',component:PostsCreateComponent,canActivate:[AuthGuard]},
  {path:'login',component:LoginComponent},
  {path:'signup',component:SignupComponent}
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(router)
  ],
  exports:[RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule { }
