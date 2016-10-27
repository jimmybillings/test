import { NgModule } from '@angular/core';
import { UserManagementComponent } from './user-management.component';
import { LoginComponent } from './+login/login.component';
import { RegisterComponent } from './+register/register.component';
import { ProfileComponent } from './+profile/profile.component';
import { ForgotPasswordComponent} from './+forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './+reset-password/reset-password.component';
import { SharedModule } from '../shared/shared.module';
import { User } from './services/user.data.service';
import { USER_ROUTES } from './user-management.routes';
import { RouterModule } from '@angular/router';
import { DocumentService } from './services/document.service';

@NgModule({
    imports: [SharedModule, RouterModule.forChild(USER_ROUTES)],
    declarations: [UserManagementComponent, LoginComponent, RegisterComponent, ProfileComponent, ForgotPasswordComponent, ResetPasswordComponent],
    exports: [UserManagementComponent],
    providers: [User, DocumentService],
})

export class UserManagementModule { }
