import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ParamMap } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject, map, startWith, catchError, of, switchMap, combineLatest } from 'rxjs';
import { DataState } from '../../enum/datastate.enum';
import { CustomHttpResponse, CustomerState } from '../../interface/appstates';
import { State } from '../../interface/state';
import { CustomerService } from '../../service/customer.service';
import { ErrorModal } from '../modals/error-modal/error-modal.component';


@Component({
  standalone: false,
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  customerState$: Observable<State<CustomHttpResponse<CustomerState>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<CustomerState>>(null);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();
  readonly DataState = DataState;
  private readonly CUSTOMER_ID: string = 'id';
  userState: any;

   @ViewChild(ErrorModal) errorModal!: ErrorModal;


  constructor(private activatedRoute: ActivatedRoute, private customerService: CustomerService) { }

  ngOnInit(): void {
    this.customerState$ = this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
        return this.customerService.customer$(+params.get(this.CUSTOMER_ID))
          .pipe(
            map(response => {
              console.log(response);
              this.dataSubject.next(response);
              this.userState = this.dataSubject.value.data.user.roleName;
              return { dataState: DataState.LOADED, appData: response };
            }),
            startWith({ dataState: DataState.LOADING }),
            catchError((error: string) => {
              return of({ dataState: DataState.ERROR, error })
            })
          )
      })
    );
  }

  updateCustomer(customerForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.customerState$ = this.customerService.update$(customerForm.value)
      .pipe(
        map(response => {
          console.log(response);
          this.dataSubject.next({ ...response,
            data: {
              ...response.data,
              customer: {
                ...response.data.customer,
                invoices: this.dataSubject.value.data.customer.invoices
              }
            }
          });

          this.isLoadingSubject.next(false);
          return { dataState: DataState.LOADED, appData: this.dataSubject.value };
        }),
        startWith({ dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.openErrorModal(error);
          this.ngOnInit();
          this.isLoadingSubject.next(false);
          return of({ dataState: DataState.ERROR, error })
        })
      )
  }

  customerStateStatus(status): any {
    if (status) {
      switch (status) {
        case 'ACTIVE':
          return 'bg-success';
        case 'PENDING':
          return 'bg-primary';
        case 'BANNED':
          return 'bg-danger';
        case 'INACTIVE':
          return 'bg-info';
        default:
          return 'bg-secondary';
      }
    }
    return 'bg-secondary';
  }

  turnDisabled(): any {
    return this.userState === 'ROLE_USER' ? 'disabled' : '';
  }

    openErrorModal(message: string): void {
      this.errorModal.errorMessage = message;
      this.errorModal.open();
  }

}
