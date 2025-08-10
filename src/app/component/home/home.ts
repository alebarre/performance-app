import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject, map, startWith, catchError, of } from 'rxjs';
import { DataState } from '../../enum/datastate.enum';
import { CustomHttpResponse, Page, Profiles } from '../../interface/appstates';
import { UserService } from '../../service/user.service.ts';
import { CustomerService } from '../../service/customer.service';
import { State } from '../../interface/state';
import { Profile } from '../profile/profile';
import { User } from '../../interface/user';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  homeState$: Observable<State<CustomHttpResponse<Page & User>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Page & User>>(null);
  
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  private currentPageSubject = new BehaviorSubject<number>(0);
  currentPage$ = this.currentPageSubject.asObservable();
  
  private showLogsSubject = new BehaviorSubject<boolean>(false);
  showLogs$ = this.showLogsSubject.asObservable();
  
  readonly DataState = DataState;
  profileEvents: any[] = [];
  message = '';

  constructor(private userService: UserService, private customerService: CustomerService) { }

  ngOnInit(): void {
    this.homeState$ = this.customerService.customers$()
      .pipe(
        map(response => {
          console.log(response);
          this.dataSubject.next(response);
          return { dataState: DataState.LOADED, appData: response };

        }),
        startWith({ dataState: DataState.LOADING }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, error })
        })
      )
  }

  goToPage(pageNumber?: number): void {
    this.homeState$ = this.customerService.customers$(pageNumber)
      .pipe(
        map(response => {
          console.log(response);
          this.dataSubject.next(response);
          this.currentPageSubject.next(pageNumber);
          return { dataState: DataState.LOADED, appData: response };

        }),
        startWith({ dataState: DataState.LOADING, appData: this.dataSubject.value }),
        catchError((error: string) => {
          return of({ dataState: DataState.ERROR, error, appData: this.dataSubject.value })
        })
      )
  }

  goToNextOrPreviusPage(direction?: string): void {
    this.goToPage(direction === 'forward' ? this.currentPageSubject.value + 1 : this.currentPageSubject.value - 1);
  }

}
