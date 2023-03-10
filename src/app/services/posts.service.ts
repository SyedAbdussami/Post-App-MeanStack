import { Injectable } from "@angular/core";
import { Posts } from "../models/posts.component";
import { Subject, from } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import{environment} from '../../environments/environment';

const BACKEND_URL=environment.apiUrl+"/posts/";

@Injectable({
  providedIn: "root"
})
export class PostsService {
  private posts: Posts[] = [];
  private postUpdated = new Subject<{posts:Posts[],postCount:number}>();
  constructor(private http: HttpClient, private router: Router) {}
  // post:Posts;

  getPosts(postsPerPage: number, currentPage: number) {
    // return [...this.posts];
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
         BACKEND_URL+ queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator:post.creator
              };
            }),
            maxPosts: postData.maxPosts
          };
        })
      )
      .subscribe(transformedPostsData => {
        this.posts = transformedPostsData.posts;
        this.postUpdated.next({posts:[...this.posts],postCount:transformedPostsData.maxPosts});
      });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  getPost(id: string) {
    // return {...this.posts.find(p=>p.id===id)};
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator:string
    }>(BACKEND_URL + id);
  }

  addPost(title: string, content: string, image: File) {
    // const post:Posts={id:null,title:title,content:content};
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http
      .post<{ messag: string; post: Posts }>(
        BACKEND_URL,
        postData
      )
      .subscribe(responseData => {
        // console.log(responseData);
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    // const post={id:id,title:title,content:content,imagePath:null}
    let postData: Posts | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator:null
      };
    }
    this.http
      .put(BACKEND_URL + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(id: string) {
    return this.http.delete(BACKEND_URL + id)
  }
}
