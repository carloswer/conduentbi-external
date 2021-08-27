import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { saveAs } from 'file-saver';
import {ReportService} from '../services/report.service';
import { NgForm, FormControl } from '@angular/forms';
import {Report} from '../models/report'
import { ToastrService } from 'ngx-toastr';
import {formatDate } from '@angular/common';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  fileName = 'FlatFile_';
  filters: Report = new Report;
  reportTypes:any;
  years:any;
  quarters:any;
  months:any;
  regions:any;
  subRegions:any;
  selectedRegions: any;
  selectedSubRegions:any;
  selectedQuarters: any;
  selectedMonths: any;
  monthsByQuarter:  Array<any>;
  subRegionsByRegion: Array<any>;

  requestStatus:any;
  addressables: any;
  productTypes:any;
  savingMethodologies:any;

  selectedRequestStatus: any;
  selectedAddressables:any;
  selectedProductTypes: any;
  selectedSavingMethodologies: any;

  isYearDisabled:boolean=false;
  isQuarterDisabled:boolean=false;
  isMonthDisabled:boolean=false;

  constructor( private reportService: ReportService,public toastr: ToastrService) {

   }

  ngOnInit() {
  //catalogsload
  this.getYears();
  this.getQuarters();
  this.getMonths();
  this.getReportTypes();
  this.getRegions();
  this.getSubRegions();
  this.getRequestStatus();
  this.getAddressables();
  this.getProductTypes();
  this.getSavingMethodologies();
  }

  getReportTypes() {
    this.reportService.getReportTypes()
      .subscribe(
        response => {
          this.reportTypes = response;
        },
        error => {
          this.toastr.error('Something went wrong. Please, contact support.', 'Oops!');
        }

      )
  }

  getYears() {
    this.reportService.getYears()
      .subscribe(
        response => {
          this.years = response;
        },
        error => {
          this.toastr.error('Something went wrong. Please, contact support.', 'Oops!');
        }

      )
  }

  getQuarters() {
    this.reportService.getQuarters()
      .subscribe(
        response => {
          this.quarters = response;
        },
        error => {
          this.toastr.error('Something went wrong. Please, contact support.', 'Oops!');
        }

      )
  }

  getMonths() {
    this.reportService.getMonths()
    .subscribe(
      response => {
        this.months = response;
      },
      error => {
        this.toastr.error('Something went wrong. Please, contact support.', 'Oops!');
      }
  
    )
  }

  getRegions() {
    this.reportService.getRegions()
      .subscribe(
        response => {
          this.regions = response;
        },
        error => {
          this.toastr.error('Something went wrong. Please, contact support.', 'Oops!');
        }

      )
  }

   getSubRegions(){
    this.reportService.getSubRegions()
    .subscribe(
      response => {
        this.subRegions = response;
      },
      error => {
        this.toastr.error('Something went wrong. Please, contact support.', 'Oops!');
      }

    )
  }

  getRequestStatus() {
    this.reportService.getRequestStatus()
      .subscribe(
        response => {
          this.requestStatus = response;
        },
        error => {
          this.toastr.error('Something went wrong. Please, contact support.', 'Oops!');
        }

      )
  }

  getAddressables() {
    this.reportService.getAddressables()
      .subscribe(
        response => {
          this.addressables = response;
        },
        error => {
          this.toastr.error('Something went wrong. Please, contact support.', 'Oops!');
        }

      )
  }

  getProductTypes() {
    this.reportService.getProductTypes()
      .subscribe(
        response => {
          this.productTypes = response;
        },
        error => {
          this.toastr.error('Something went wrong. Please, contact support.', 'Oops!');
        }

      )
  }

  getSavingMethodologies() {
    this.reportService.getSavingMethodologies()
      .subscribe(
        response => {
          this.savingMethodologies = response;
        },
        error => {
          this.toastr.error('Something went wrong. Please, contact support.', 'Oops!');
        }

      )
  }


  disablePeriodFileds(){
    this.filters.Year=undefined;
    this.selectedQuarters=[];
    this.selectedMonths=[];
    this.isYearDisabled=true;
    this.isQuarterDisabled=true;
    this.isMonthDisabled=true;
  
  }

  enablePeriodFields(){
    this.isYearDisabled=false;
    this.isQuarterDisabled=false;
    this.isMonthDisabled=false;
  }

  onChangeRequestStatus(event) {
    var status=event.map(r=>r.RequestStatus);
    if(status.length==1 && status=="Pending")this.disablePeriodFileds(); else this.enablePeriodFields();
   }


  onChangeQuarter(event) {
    var quartersId=event.map(q=>q.Id);
    this.monthsByQuarter = this.months.filter(c => quartersId.indexOf(c.QuarterId) > -1);
   }

  onChangeRegion(event) {
    var regionsId=event.map(b=>b.Id);
    this.subRegionsByRegion = this.subRegions.filter(s => regionsId.indexOf(s.RegionId) >-1);
  }


  OnSubmit(form: NgForm) {
    if(this.selectedQuarters != null){this.filters.Quarter=this.selectedQuarters.map(i=>i.Id).join();}
    if(this.selectedMonths != null){this.filters.Month=this.selectedMonths.map(m=>m.Id).join();}
   /* this.filters.Region=this.selectedRegions.map(r=>r.Region).join();
    this.filters.SubRegion=this.selectedSubRegions.map(s=>s.SubRegion).join();
    this.filters.RequestStatus=this.selectedRequestStatus.map(rs=>rs.RequestStatus).join();
    this.filters.Addressable=this.selectedAddressables.map(a=>a.Addressable).join();
    this.filters.ProductType=this.selectedProductTypes.map(p=>p.ProductType).join();
    this.filters.SavingMethodology=this.selectedSavingMethodologies.map(sm=>sm.SavingMethodology).join();*/
    if(this.selectedRegions != null){this.filters.Region=this.selectedRegions.map(r=>r.Region).join();}
    if(this.selectedSubRegions != null){this.filters.SubRegion=this.selectedSubRegions.map(s=>s.SubRegion).join();}
    if(this.selectedRequestStatus != null){this.filters.RequestStatus=this.selectedRequestStatus.map(rs=>rs.RequestStatus).join();}
    if(this.selectedAddressables != null) {this.filters.Addressable=this.selectedAddressables.map(a=>a.Addressable).join();}
    if(this.selectedProductTypes != null) {this.filters.ProductType=this.selectedProductTypes.map(p=>p.ProductType).join();}
    if(this.selectedSavingMethodologies != null){this.filters.SavingMethodology=this.selectedSavingMethodologies.map(sm=>sm.SavingMethodology).join();}
    this.downloadToExcel();
   // console.log(this.filters);
  }

  downloadToExcel() {
    // download file
   this.blockUI.start('Downloading...');
    this.reportService.extractFlatFile(this.filters).subscribe(
      (response: any) =>  {    
         var date= new Date();
         var today = formatDate(date, 'MMddyy', 'en-US');
         const blob = new Blob([response], { type : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
         const file = new File([blob], this.fileName + today +'.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
         saveAs(file);
         this.blockUI.stop();
      },
      response => {
          // notify error
          this.blockUI.stop();
          this.toastr.error('Something went wrong. Please, contact support.', 'Oops!');
      }
  );
  }

 
}
