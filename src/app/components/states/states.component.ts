import { Component, OnInit } from '@angular/core';

import { DataService } from "../../services/data.service";

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.scss'],
})
export class StatesComponent implements OnInit {

  uniqueStates: Set<any> = new Set();

  constructor(public dataService: DataService) {}

  ngOnInit(): void {
    if (localStorage.getItem('states')) {
      this.dataService.userPreferences.states = JSON.parse(
        localStorage.getItem('states')
      );
    }

    this.dataService.getCountyLevel().subscribe((x: Array<any>) => {
      this.dataService.stateData = x;
      x.forEach((item, idx) => {
        this.uniqueStates.add(item.provinceState);
        if (idx === x.length - 1) {
          this.dataService.statesArr = Array.from(this.uniqueStates).sort();
        }
      });
    });
  }
}
