import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from '../../enum/datastate.enum';
import { UserService } from '../../service/userService';
import { State } from '../../interface/state';
import { CustomHttpResponse, Profiles } from '../../interface/appstates';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  profileState$: Observable<State<CustomHttpResponse<Profiles>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Profiles>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.profileState$ = this.userService.profile$()
      .pipe(
        map(response => {
          console.log(response);
          this.dataSubject.next(response);
          return { dataState: DataState.LOADED, appData: response };

        }),
        startWith({ dataState: DataState.LOADING }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, appData: this.dataSubject.value, error })
        })
      )
  }

  updateProfile(profileForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.profileState$ = this.userService.update$(profileForm.value)
      .pipe(
        map(response => {
          console.log(response);
          this.dataSubject.next({ ...response, data: response.data });
          this.isLoadingSubject.next(false);
          return { dataState: DataState.LOADED, appData: this.dataSubject.value };

        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({ dataState: DataState.LOADED, appData: this.dataSubject.value, error })
        })
      )
  }

  updatePassword(passwordForm: NgForm): void {
    this.isLoadingSubject.next(true);
    if (passwordForm.value.newPassword === passwordForm.value.confirmNewPassword) {
      this.profileState$ = this.userService.updatePassword$(passwordForm.value)
        .pipe(
          map(response => {
            passwordForm.reset();
            this.isLoadingSubject.next(false);
            return { dataState: DataState.LOADED, appData: this.dataSubject.value };
          }),
          startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
          catchError((error: string) => {
            passwordForm.reset();
            this.isLoadingSubject.next(false);
            return of({ dataState: DataState.LOADED, appData: this.dataSubject.value, error })
          })
        )
    } else {
      passwordForm.reset();
      this.isLoadingSubject.next(false);
    }
  }

  updateRole(roleForm: NgForm): void {
    this.isLoadingSubject.next(true);
    console.log(roleForm.value);
    this.profileState$ = this.userService.updateRoles$(roleForm.value.roleName)
      .pipe(
        map(response => {
          this.dataSubject.next({ ...response, data: response.data });
          this.isLoadingSubject.next(false);
          return { dataState: DataState.LOADED, appData: this.dataSubject.value };
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({ dataState: DataState.LOADED, appData: this.dataSubject.value, error })
        })
      )
  }

  updateAccountSettings(settingsForm: NgForm): void {
    this.isLoadingSubject.next(true);
    console.log(settingsForm.value);
    this.profileState$ = this.userService.updateAccountSettings$(settingsForm.value)
      .pipe(
        map(response => {
          this.dataSubject.next({ ...response, data: response.data });
          this.isLoadingSubject.next(false);
          return { dataState: DataState.LOADED, appData: this.dataSubject.value };
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({ dataState: DataState.LOADED, appData: this.dataSubject.value, error })
        })
      )
  }

  toglleMfa(): void {
    this.isLoadingSubject.next(true);
    this.profileState$ = this.userService.toggleMfa$()
      .pipe(
        map(response => {
          this.dataSubject.next({ ...response, data: response.data });
          this.isLoadingSubject.next(false);
          return { dataState: DataState.LOADED, appData: this.dataSubject.value };
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({ dataState: DataState.LOADED, appData: this.dataSubject.value, error })
        })
      )
  }

  updatePicture(image: File): void {
    if (image) {
      this.isLoadingSubject.next(true);
      this.profileState$ = this.userService.updateImage$(this.getFormData(image))
        .pipe(
          map(response => {
            console.log(response);
            this.dataSubject.next({ ...response, 
              data: { ...response.data, 
                user: { ...response.data.user, imageUrl: `${response.data.user.imageUrl}?time=${new Date().getTime()}`}} });
            this.isLoadingSubject.next(false);
            return { dataState: DataState.LOADED, appData: this.dataSubject.value };
          }),
          startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
          catchError((error: string) => {
            this.isLoadingSubject.next(false);
            return of({ dataState: DataState.LOADED, appData: this.dataSubject.value, error })
          })
        )
    }
  }
  
  private getFormData(image: File): FormData {
    const formData  = new FormData();
    formData.append('image', image);
    return formData;
  }

}
