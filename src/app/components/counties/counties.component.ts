import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from "rxjs";

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-counties',
  templateUrl: './counties.component.html',
  styleUrls: ['./counties.component.scss'],
})
export class CountiesComponent implements OnInit {
  states: Array<any> = [];
  counties: Array<any> = [];
  uniqueStates: Set<any> = new Set();
  filteredCounties: Observable<string[]>;

  constructor(public db: AngularFirestore, public dataService: DataService) {}

  ngOnInit(): void {
    if (localStorage.getItem('counties')) {
      this.dataService.userPreferences.counties = JSON.parse(
        localStorage.getItem('counties')
      );
    }

    this.db
      .collection('counties', ref => ref.orderBy('combinedKey'))
      .valueChanges()
      .subscribe((x: Array<any>) => {
        this.dataService.countiesData = x;
      });
  }
}
