import { LoginComponent} from './+login/login.component';
import { RegisterComponent} from './+register/register.component';
import { ProfileComponent} from './+profile/profile.component';
import { Routes } from '@angular/router';
import { UserManagementComponent } from './user-management.component';

export const USER_ROUTES: Routes = [
  {
    path: 'user',
    component: UserManagementComponent,
    children: [
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  }
];

