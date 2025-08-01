import { Component, Input } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-error-modal',
  templateUrl: './error-modal.html',
  styleUrls: ['./error-modal.css']
})
export class ErrorModal {

  @Input() errorMessage: any;

  show = false;
  modalMessage = '';

  open() {
    this.modalMessage = this.errorMessage || '';
    this.show = true;
  }

  close() {
    this.show = false;
  }


}
