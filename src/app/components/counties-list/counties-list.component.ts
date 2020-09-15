import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface DataType {
  county: string;
  popValue: number;
  confirmed: number;
  deaths: number;
  recovered: number;
  population: {
    value: string;
    density: string;
  }
  confirmedpc: string;
  deathspc: string;
  density: string;
}

const initialData: Array<DataType> = [];

@Component({
  selector: 'app-counties-list',
  templateUrl: './counties-list.component.html',
  styleUrls: ['./counties-list.component.scss'],
})
export class CountiesListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'county',
    'confirmed',
    'deaths',
    'popValue',
    'density',
  ];
  dataSource = new MatTableDataSource(initialData);

  currentState: string;
  listType: string;
  currentRegion: string;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public route: ActivatedRoute, public db: AngularFirestore) {}

  getTotals(key: string) {
    return this.dataSource.data
      .map((t) => t[key])
      .reduce((acc, value) => acc + value, 0);
  }

  ngOnInit(): void {
    this.route.params.subscribe((x) => {
      this.listType = x.type;
      this.currentRegion = x.region;
      console.log('type', this.listType);
      console.log('region', this.currentRegion);
    });
    this.route.params.subscribe((x) => {
      this.currentState = x.state;
    });
    this.db
      .collection('counties', (ref) =>
        ref.where('stateSearch', '==', this.currentState)
      )
      .valueChanges()
      .subscribe((x: Array<DataType>) => {
        x.forEach(item => {
          item['popValue'] = parseInt(item.population?.value, 10);
          item['confirmedpc'] = (item.confirmed / item.popValue).toFixed(5);
          item['deathspc'] = (item.deaths / item.popValue).toFixed(7);
          item['density'] = parseFloat(item.population?.density).toFixed(4);
          this.dataSource.data.push(item);
        })
        this.dataSource.sort = this.sort;
      });
  }

  ngOnDestroy() {
    this.dataSource.data.length = 0;
  }
}
