import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TimeagoModule } from 'ngx-timeago';
import { CreditsComponent } from './components/credits/credits.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NavigationComponent } from './components/navigation/navigation.component';
import { CountySearchComponent } from './components/county-search/county-search.component';
import { TimeSeriesComponent } from './components/time-series/time-series.component';
import { NewDashboardComponent } from './components/new-dashboard/new-dashboard.component';
import { DashboardItemComponent } from './components/dashboard-item/dashboard-item.component';
import { CountiesListComponent } from './components/counties-list/counties-list.component';

const matModules = [
  MatToolbarModule,
  MatCardModule,
  MatListModule,
  MatExpansionModule,
  MatButtonModule,
  MatSelectModule,
  MatIconModule,
  MatDialogModule,
  MatMenuModule,
  MatBadgeModule,
  MatTooltipModule,
  MatInputModule,
  MatAutocompleteModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatSortModule,
  MatTabsModule,
  MatButtonToggleModule,
];

@NgModule({
  declarations: [
    AppComponent,
    CreditsComponent,
    NavigationComponent,
    CountySearchComponent,
    TimeSeriesComponent,
    NewDashboardComponent,
    DashboardItemComponent,
    CountiesListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAnalyticsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ...matModules,
    TimeagoModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
