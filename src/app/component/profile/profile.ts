import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from '../../enum/datastate.enum';
import { UserService } from '../../service/userService';
import { State } from '../../interface/state';
import { CustomHttpResponse, Profiles } from '../../interface/appstates';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  profileState$: Observable<State<CustomHttpResponse<Profiles>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Profiles>>(null);
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

}
