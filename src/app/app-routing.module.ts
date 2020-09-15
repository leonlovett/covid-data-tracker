import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TimeSeriesComponent } from './components/time-series/time-series.component';
import { NewDashboardComponent } from './components/new-dashboard/new-dashboard.component';
import { CountiesListComponent } from "./components/counties-list/counties-list.component";

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'counties/:state', component: CountiesListComponent },
  { path: 'list/:type/:region', component: CountiesListComponent },
  { path: 'time-series', component: TimeSeriesComponent },
  { path: 'dashboard', component: NewDashboardComponent },
  { path: 'new-dashboard', component: NewDashboardComponent },
  { path: '**', redirectTo: '/dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
