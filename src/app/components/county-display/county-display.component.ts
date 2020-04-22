import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-county-display',
  templateUrl: './county-display.component.html',
  styleUrls: ['./county-display.component.scss'],
})
export class CountyDisplayComponent implements OnInit {
  @Input() searchCriteria: any;
  currentData: any;

  constructor(public db: AngularFirestore, public dataService: DataService) {}

  removeCounty() {
    const idx = this.dataService.userPreferences.counties.findIndex(
      (item) => item.county === this.searchCriteria.county
    );
    this.dataService.userPreferences.counties.splice(idx, 1);
    localStorage.setItem(
      'counties',
      JSON.stringify(this.dataService.userPreferences.counties)
    );
  }

  ngOnInit(): void {
    this.db
      .collection('counties', (ref) =>
        ref.where('combinedKey', '==', `${this.searchCriteria.county}, US`)
      )
      .valueChanges().subscribe(x => {
        this.currentData = x[0];
      });
  }
}
