import { NgModule } from '@angular/core';
import{ ReactiveFormsModule} from '@angular/forms';
import { PostsCreateComponent } from './components/posts-create/posts-create.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { AngularMaterialModule } from './angular-material.module';

@NgModule({
  declarations:[
    PostsCreateComponent,
    PostListComponent
  ],
  imports:[
    ReactiveFormsModule,
    CommonModule,
    AppRoutingModule,
    AngularMaterialModule
  ]
})
export class PostModule{}
