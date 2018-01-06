import { BadRequestComponent } from './+bad-request/bad-request.component';
import { ErrorComponent } from './error.component';
import { Routes } from '@angular/router';
import { NotFoundComponent } from './+not-found/not-found.component';

export const ERROR_ROUTES: Routes = [
  {
    path: 'error',
    component: ErrorComponent,
    children: [
      {
        path: '404',
        component: NotFoundComponent,
        data: { title: 'PAGE_TITLE.NOT_FOUND' }
      },
      {
        path: '400',
        component: BadRequestComponent,
        data: { title: 'PAGE_TITLE.BAD_REQUEST' }
      }
    ]
  }
];
