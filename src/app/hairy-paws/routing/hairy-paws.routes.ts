import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {NotificationsPageComponent} from '../pages/notifications-page/notifications-page.component';
import {HairyPawsPageComponent} from '../pages/hairy-paws-page/hairy-paws-page.component';


const routes: Routes = [
  {
    path: '',
    component: HairyPawsPageComponent,
    children: [
      {
        path: 'notifications', component: NotificationsPageComponent
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HairyPawsRoutingModule {
}
