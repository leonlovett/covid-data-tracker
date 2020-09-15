import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-time-series',
  templateUrl: './time-series.component.html',
  styleUrls: ['./time-series.component.scss'],
})
export class TimeSeriesComponent implements OnInit {
  constructor(public db: AngularFirestore) {}

  ngOnInit(): void {
    this.db
      .collection('daily')
      .doc('1-31-2020')
      .valueChanges()
      .subscribe((x) => console.log(x));
  }
}
