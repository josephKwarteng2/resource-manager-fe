import { Route } from '@angular/router';
import { DashboardComponent } from '../admin/pages/dashboard/dashboard.component';
import { AccountSetupComponent } from '../admin/pages/account-setup/account-setup.component';
import { UsercreationComponent } from '../admin/pages/usercreation/usercreation.component';
import { UsersComponent } from '../admin/pages/users/users.component';
import { MainComponent } from '../admin/main.component';
import { SettingsComponent } from '../admin/pages/settings/settings.component';

export const AdminRoutes: Route[] = [
  {
    path: 'account-setup',
    component: AccountSetupComponent,
  },
  {
    path: 'create-user',
    component: UsercreationComponent,
  },
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },

      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
    ],
  },
];
