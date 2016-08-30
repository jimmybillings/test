import { NgModule } from '@angular/core';
import { UserManagementComponent } from './user-management.component';
import { LoginComponent } from './+login/login.component';
import { RegisterComponent } from './+register/register.component';
import { ProfileComponent } from './+profile/profile.component';
import { SharedModule } from '../shared/shared.module';
import { User } from './services/user.data.service';
import { USER_ROUTES } from './user-management.routes';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [SharedModule.forRoot(), RouterModule.forChild(USER_ROUTES)],
    declarations: [UserManagementComponent, LoginComponent, RegisterComponent, ProfileComponent],
    exports: [UserManagementComponent],
    providers: [User],
})

export class UserManagementModule { }
