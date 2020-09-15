import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-new-dashboard',
  templateUrl: './new-dashboard.component.html',
  styleUrls: ['./new-dashboard.component.scss'],
})
export class NewDashboardComponent implements OnInit {
  dashboardItems: Array<any> = [];
  uniqueStates: Set<any> = new Set();

  constructor(public dataService: DataService, public db: AngularFirestore) {}

  ngOnInit(): void {
    this.dataService.dashboardItems = JSON.parse(
      localStorage.getItem('dashboardItems')
    );
    this.dataService.getCountyLevel().subscribe((x: Array<any>) => {
      this.dataService.stateData = x;
      x.forEach((item, idx) => {
        this.uniqueStates.add(item.provinceState);
        if (idx === x.length - 1) {
          this.dataService.statesArr = Array.from(this.uniqueStates).sort();
        }
      });
    });
    this.db
      .collection('countries')
      .get()
      .subscribe((x) => {
        x.forEach((item) => {
          this.dataService.countryList.push(item.data());
        });
      });
  }
}
