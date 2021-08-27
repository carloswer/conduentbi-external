import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RegionService } from '../services/region.service';
import * as $ from 'jquery';
import * as pbi from 'powerbi-client';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Report } from "report";
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';



@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})



export class ContainerComponent implements OnInit {
  
 // @ViewChild('reportContainer') reportContainer: ElementRef;  
 @BlockUI() blockUI: NgBlockUI;
  newLink: any; 
  info:any;
  reportId: string;


  constructor(private regionService: RegionService, public toastr: ToastrService, private sanitizer: DomSanitizer) {}

  getLink():void{
    console.log("Link: " + this.regionService.getLink());
    //this.newLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.regionService.getLink());
    this.newLink = this.regionService.getLink();
    const iframe =  document.getElementById('biFrame');
    // if(this.newLink != undefined && this.newLink != null){
    //   (iframe as any).src = this.newLink;
    // }

    
    //   $('iframe').on('mouseenter', function () {
    //       $(this).trigger( "click" );
    // });
    if (this.newLink != null && this.newLink != undefined)
    {
      (iframe as any).src = this.newLink;
      //get reportId from Embed URL
      const urlParsed = new URL(this.newLink);
      this.reportId = urlParsed.searchParams.get("reportId");
      this.getReport(this.reportId); 
    }

  }

  detec() { 
      if (navigator.userAgent.match(/Android/i) 
          || navigator.userAgent.match(/webOS/i) 
          || navigator.userAgent.match(/iPhone/i)  
          || navigator.userAgent.match(/iPad/i)  
          || navigator.userAgent.match(/iPod/i) 
          || navigator.userAgent.match(/BlackBerry/i) 
          || navigator.userAgent.match(/Windows Phone/i)) {
            //console.log(true); 
         return true; 
      } else { 
        //console.log(false); 
         return false; 
      }  
  } 

  showReport() {  
 
    // Embed configuration used to describe the what and how to embed.
    // This object is used when calling powerbi.embed.
    // This also includes settings and options such as filters.
    // You can find more information at https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details. 
   var config: pbi.IEmbedConfiguration  = {  
        type: 'report',  
        tokenType: pbi.models.TokenType.Embed,
        accessToken: this.info.EmbedToken.token,  
        embedUrl: this.info.EmbedUrl,  
        id: this.info.Id,
        permissions: pbi.models.Permissions.Read,
        viewMode: pbi.models.ViewMode.View,
        settings: {
          filterPaneEnabled: false,
          navContentPaneEnabled: false
      }
  };

    // You can find more information at https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details. 
    var mobileConfig: pbi.IEmbedConfiguration  = {  
      type: 'report',  
      tokenType: pbi.models.TokenType.Embed,
      accessToken: this.info.EmbedToken.token,  
      embedUrl: this.info.EmbedUrl,  
      id: this.info.Id,
      permissions: pbi.models.Permissions.Read,
      viewMode: pbi.models.ViewMode.View,
      settings: {
        filterPaneEnabled: false,
        navContentPaneEnabled: false,
        layoutType: pbi.models.LayoutType.MobilePortrait
    }
};

    // Get a reference to the embedded report HTML element
    //const reportContainer = this.reportContainer.nativeElement;  
    var reportContainer = <HTMLElement>document.getElementById(
      'biFrame'
    );

 
    //The Power BI Service embed component, which is the entry point to embed all other Power BI components into the application
    var powerbi = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory);  
    powerbi.reset(reportContainer);
    // Embed the report and display it within the div container.
    
    //var report: Report = <Report>(powerbi.embed(reportContainer, config));  
    var report: Report = <Report>(powerbi.load(reportContainer, config));  
    
    // Report.off removes a given event handler if it exists.
    report.off("loaded");  
    // Report.on will add an event handler which prints to console window.
    report.on("loaded", () => {  
        //console.log("Loaded");  
      if(this.detec()==true){
        report.getPages().then(function (pages) {
          pages[0].hasLayout(pbi.models.LayoutType.MobilePortrait).then(function (hasLayout) {
           // console.log(hasLayout);
             if(hasLayout)
             { powerbi.reset(reportContainer);
              // Embed the report and display it within the div container.
              var mobileReport: Report = <Report>(powerbi.embed(reportContainer, mobileConfig));  
             }              
          })
      });
    }

      //report.render();
    
    });  
    // Report.off removes a given event handler if it exists.
    report.off("rendered");
    // Report.on will add an event handler which prints to console window.
    report.on("rendered", function () {
    //console.log("Rendered");
   
     /* reportContainer.onmouseout = function(e) { 
      var trusted = e.isTrusted;
       console.log("mouse out iframe"); 
       alert(trusted);
       }; */

    //$('#idBtnTest').trigger("click");

    });
   
   /* report.on("buttonClicked", event => {
      console.log("buttonClicked", event);
      $('#biFrame').trigger("mouseout");
      reportContainer.onmouseout = function() {  
       console.log("mouse out iframe"); 
       };  
    });*/


    report.on("error", () => {  
      this.getReport(this.reportId); 
      report.off("error");
    });  

  
} 

getReport(reportId): void {
  //this.blockUI.start('Loading...');
  this.regionService.getToken(reportId)
    .subscribe(
      response => {
        this.info = response;
       //console.log(this.info.ErrorMessage);
        this.showReport(); 
        this.blockUI.stop();
      },
      error => {
       this.blockUI.stop();
       this.showError('Something went wrong. Please, contact support.');
       //console.log(error);
      }
    )
}

showError(text) {
  this.toastr.error(text, 'Oops!');
}

  ngOnInit() { 
    this.getLink();  
  }


 
}
  