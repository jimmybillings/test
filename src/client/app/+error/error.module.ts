import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ERROR_ROUTES } from './error.routes';
import { ErrorComponent } from './error.component';
import { BadRequestComponent } from './+bad-request/bad-request.component';
import { BadServerRequestComponent } from './+bad-server-request/bad-server-request.component';
import { NotFoundComponent } from './+not-found/not-found.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(ERROR_ROUTES)],
  declarations: [ErrorComponent, NotFoundComponent, BadRequestComponent, BadServerRequestComponent],
  exports: [ErrorComponent]
})
export class ErrorModule { }
