import { Injectable} from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { UserService } from "../shared/user.service";
import { BsModalRef,BsModalService } from 'ngx-bootstrap/modal';
import { CustomSessionTimeoutComponent } from '../custom-session-timeout/custom-session-timeout.component';


@Injectable({
    providedIn: 'root'
})
export class InactivityService {
    title = 'Your session is about to expire!';
    idleState = 'Not started.';
    timedOut = false;
    lastPing?: Date = null;
    modal:BsModalRef;
  

    constructor(
        private idle: Idle,
        private keepalive: Keepalive,
        private userService: UserService,
        private modalService: BsModalService
    ) { }

  startWatching() {
    // sets an idle timeout of x seconds
    this.idle.setIdle(800); //13min

    // sets a timeout period of x seconds. after 20 seconds of inactivity, the user will be considered timed out.
    this.idle.setTimeout(20);//20

    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.';
      //console.log(this.idleState);
    });


    this.idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.logout();
      this.modal.hide();
      //console.log(this.idleState);
    });

    this.idle.onIdleStart.subscribe(() => {
      //opens modal after x seconds idleness
      this.idleState = 'IDLE_START', this.openModal(1);
    });

    this.idle.onTimeoutWarning.subscribe((countdown: any) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!';
      //console.log(this.idleState);
      //populates input data for modal
      this.modal.content.count = countdown;
    }

    );

    // sets the ping interval to 15 seconds
    this.keepalive.interval(15);
    //this.keepalive.onPing.subscribe(() => this.lastPing = new Date());
    this.reset();
  }


  openModal(count: number) {
    this.modal = this.modalService.show(CustomSessionTimeoutComponent);
    this.modal.content.title = this.title;
    this.modal.content.count = count;
    this.modal.content.passEntry.subscribe((receivedEntry: any) => {
      //console.log(receivedEntry);
      if (receivedEntry !== '' && 'logout' === receivedEntry) {
        this.logout();
      } else {
        this.reset();
      }
    })
  }


  resetTimeOut() {
    this.idle.stop();
    //this.idle.onIdleStart.unsubscribe();
    //this.idle.onTimeoutWarning.unsubscribe();
    // this.idle.onIdleEnd.unsubscribe();

    this.idle.onTimeout.observers.length = 0;
    this.idle.onIdleStart.observers.length = 0;
    this.idle.onIdleEnd.observers.length = 0;
  }
  ngOnDestroy() {
    this.resetTimeOut();

  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
    //console.log(this.idleState);
  }

  logout() {
    this.resetTimeOut();
    this.userService.logout();
    //this.modal.hide();

  }

    

}