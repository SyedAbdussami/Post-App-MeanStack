import { Component, OnInit, OnDestroy } from "@angular/core";
import { Posts } from "../../models/posts.component";
import { PostsService } from "../../services/posts.service";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material/paginator";
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  // @Input()
  posts: Posts[];
  private postSub: Subscription;
  private authStatusSub:Subscription;
  userIsAuthenticated=false;
  public isLoading: boolean = false;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  postSizeOptions = [1, 2, 5, 10];
  userId:string;
  constructor(public postService: PostsService,private authService:AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.userId=this.authService.getUserId();
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.postSub = this.postService
      .getPostUpdateListener()
      .subscribe((postData:{ posts:Posts[],postCount:number}) => {
        this.isLoading = false;
        this.totalPosts=postData.postCount;
        this.posts = postData.posts;
      });
    this.userIsAuthenticated=this.authService.getAuthStatus();
      this.authStatusSub=this.authService.getAuthStatusListener().subscribe(
        isAuthenticated=>{
          this.userIsAuthenticated=isAuthenticated;
          this.userId=this.authService.getUserId();
        }
      )
  }
  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
  onChangedPage(pageData: PageEvent) {
    this.isLoading=true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPosts(this.postsPerPage, pageData.pageIndex + 1);
  }

  onDelete(id: string) {
    this.isLoading=true;
    this.postService.deletePost(id).subscribe(()=>{
      this.postService.getPosts(this.postsPerPage,this.currentPage);
    },error=>{
      this.isLoading=false;
    });
  }
}
