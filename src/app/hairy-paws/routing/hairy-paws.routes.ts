import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {NotificationsPageComponent} from '../pages/notifications-page/notifications-page.component';
import {HairyPawsPageComponent} from '../pages/hairy-paws-page/hairy-paws-page.component';
import {PetsPageComponent} from '../pages/pets-page/pets-page.component';
import {PetsFilterTableComponent} from '../components/pets-filter-table/pets-filter-table.component';
import {MyPetsPageComponent} from '../pages/my-pets-page/my-pets-page.component';


const routes: Routes = [
  {
    path: '',
    component: HairyPawsPageComponent,
    children: [
      {path: 'pets', component: PetsPageComponent},
      {path: 'filter-pets', component: PetsFilterTableComponent},
      {path: 'notifications', component: NotificationsPageComponent},
      {path: 'my-pets', component: MyPetsPageComponent},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HairyPawsRoutingModule {
}
