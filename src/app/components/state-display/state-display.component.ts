import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-state-display',
  templateUrl: './state-display.component.html',
  styleUrls: ['./state-display.component.scss'],
})
export class StateDisplayComponent implements OnInit {
  @Input() searchCriteria: any;
  currentData: any;

  constructor(public db: AngularFirestore, public dataService: DataService) {}

  removeState() {
    const idx = this.dataService.userPreferences.states.findIndex(
      (item) => item.state === this.searchCriteria.state
    );
    this.dataService.userPreferences.states.splice(idx, 1);
    localStorage.setItem(
      'states',
      JSON.stringify(this.dataService.userPreferences.states)
    );
  }

  ngOnInit(): void {
    this.db
      .collection('states')
      .doc(this.searchCriteria.state)
      .valueChanges()
      .subscribe((x) => {
        this.currentData = x;
      });
  }
}
