import { Component, OnInit, Output, EventEmitter, OnDestroy } from "@angular/core";
import { Posts } from "../../models/posts.component";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PostsService } from "../../services/posts.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { ReadVarExpr } from "@angular/compiler";
import { mimType } from "./mime-type.validator";
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: "app-posts-create",
  templateUrl: "./posts-create.component.html",
  styleUrls: ["./posts-create.component.css"]
})
export class PostsCreateComponent implements OnInit,OnDestroy {
  // @Output() postCreated=new EventEmitter<Posts>();

  private mode = "create";
  private postId: string;
  public post: Posts;
  ImagePreview: string;
  form: FormGroup;
  public isLoading: boolean = false;
  private authStatusSub:Subscription;
  constructor(public postService: PostsService, public route: ActivatedRoute,public authService:AuthService) {}

  ngOnInit() {
  this.authStatusSub= this.authService.getAuthStatusListener().subscribe(()=>{
    this.isLoading=false;
  })
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator:postData.creator
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.ImagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.postService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }
  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
}
