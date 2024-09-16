import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { User } from '../../_models/user';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { AccountService } from '../../_services/account.service';
import { Photo } from '../../_models/photo';
import { ActivatedRoute } from '@angular/router';
import { DecimalPipe, NgClass, NgStyle } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideTrash2, lucideUpload } from '@ng-icons/lucide';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-images-screen',
  standalone: true,
  imports: [NgClass, FileUploadModule, DecimalPipe, NgStyle, NgIconComponent],
  templateUrl: './images-screen.component.html',
  styleUrl: './images-screen.component.scss',
  viewProviders: [provideIcons({ lucideTrash2, lucideUpload })],
})
export class ImagesScreenComponent {
  id: WritableSignal<string | null> = signal(null);
  inputUser: WritableSignal<User | null> = signal(null);
  baseUrl = environment.apiUrl;
  uploader: FileUploader | undefined;
  hasBaseDropZoneOver: WritableSignal<boolean> = signal(false);
  addPhotosMode: WritableSignal<boolean> = signal(false);
  loading: WritableSignal<boolean> = signal(false);

  constructor(
    public accountService: AccountService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.id.set(id);
      this.accountService.getUser(id).subscribe({
        next: (user) => {
          this.inputUser.set(user);
          this.initializeUploader();
        },
      });
    }
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver.set(e);
  }

  setMainPhoto(photo: Photo) {
    const user = this.accountService.currentUser();
    const inputUser = this.inputUser();
    if (!user || !inputUser) return;
    this.loading.set(true);
    this.accountService.setMainPhoto(photo.id).subscribe({
      next: () => {
        user.profileImageUrl = photo.url;
        user.photos.forEach((p) => {
          if (p.id === photo.id) p.isMain = true;
          else p.isMain = false;
        });
        this.accountService.currentUser.update((user) => {
          if (!user) return null;
          user.profileImageUrl = photo.url;
          user.photos.forEach((p) => {
            if (p.id === photo.id) p.isMain = true;
            else p.isMain = false;
          });
          return user;
        });
        this.inputUser.update((user) => {
          if (!user) return null;
          user.profileImageUrl = photo.url;
          user.photos.forEach((p) => {
            if (photo.isMain) p.isMain = false;
            if (p.id === photo.id) p.isMain = true;
          });
          return user;
        });
        this.accountService.setCurrentUser(user);
        this.loading.set(false);
      },
      error: (_) => {
        console.log('Error setting main photo');
        this.toastr.error('Error setting main photo');
        this.loading.set(false);
      },
    });
  }

  deletePhoto(photoId: number) {
    const inputUser = this.inputUser();
    if (!inputUser) return;
    this.loading.set(true);
    this.accountService.deletePhoto(photoId).subscribe({
      next: (_) => {
        this.inputUser.update((user) => {
          if (!user) return null;
          user.photos = user.photos.filter((x) => x.id !== photoId);
          return user;
        });
        this.loading.set(false);
      },
      error: (_) => {
        console.log('Error deleting the photo');
        this.toastr.error('Error deleting the photo');
        this.loading.set(false);
      },
    });
  }

  initializeUploader() {
    const user = this.accountService.currentUser();
    const inputUser = this.inputUser();
    if (!user || !inputUser) return;
    this.uploader = new FileUploader({
      url: this.baseUrl + 'photos/' + user.id,
      authToken: 'Bearer ' + user?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);
        this.inputUser.update((user) => {
          if (!user) return null;
          user.photos.push(photo);
          return user;
        });
        if (photo.isMain && user && inputUser) {
          this.accountService.currentUser.update((user) => {
            if (!user) return null;
            user.profileImageUrl = photo.url;
            return user;
          });
          this.inputUser.update((user) => {
            if (!user) return null;
            user.profileImageUrl = photo.url;
            return user;
          });
          this.accountService.setCurrentUser(user);
        }
      }
    };
  }
}
