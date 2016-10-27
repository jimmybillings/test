import { LoginComponent} from './+login/login.component';
import { RegisterComponent} from './+register/register.component';
import { ProfileComponent} from './+profile/profile.component';
import { ForgotPasswordComponent} from './+forgot-password/forgot-password.component';
import { Routes } from '@angular/router';
import { UserManagementComponent } from './user-management.component';
import { LoggedInGuard } from './services/logged-in.guard';
import { LoggedOutGuard } from './services/logged-out.guard';
import { ResetPasswordComponent } from './+reset-password/reset-password.component';

export const USER_ROUTES: Routes = [
  {
    path: 'user',
    component: UserManagementComponent,
    children: [
      { path: 'register', component: RegisterComponent, canActivate: [LoggedInGuard] },
      { path: 'login', component: LoginComponent, canActivate: [LoggedInGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [LoggedOutGuard] },
      { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [LoggedInGuard] },
      { path: 'reset-password', component: ResetPasswordComponent, canActivate: [LoggedInGuard] }
    ]
  }
];

