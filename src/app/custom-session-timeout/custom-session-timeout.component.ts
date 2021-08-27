import { Component, OnInit,Input, EventEmitter, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-custom-session-timeout',
  //templateUrl: './custom-session-timeout.component.html',
  template: 
  `<div class="modal-header">
    <h4 class="modal-title pull-left"><i class="glyphicon glyphicon-time"></i> {{title}}</h4>
    <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
      <p>Due to inactivity, your session will time out in {{count}} seconds.</p>
     
  </div>
  <div class="modal-footer">
      <button type="button" class="btn btn-danger" (click)="logout()"> Logout </button>
        <button type="button" class="btn btn-secondary" (click)="continue()" >Stay connected</button>
    </div>`
 
 // styleUrls: ['./custom-session-timeout.component.css']
})
export class CustomSessionTimeoutComponent implements OnInit{
  @Input() count:number;
  @Input() title:string;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  constructor(public bsModalRef: BsModalRef) {
  }
  continue() {
    this.passEntry.emit('');
    this.bsModalRef.hide();
    
  }
  logout() {
    this.passEntry.emit('logout');
    this.bsModalRef.hide();
   
  }
  ngOnInit() {
   // console.log('BsModalRef from modal content component', this.bsModalRef);
  }

}
