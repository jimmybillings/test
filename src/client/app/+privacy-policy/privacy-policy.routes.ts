import { Routes } from '@angular/router';

import { PrivacyPolicyResolver } from './services/privacy-policy.resolver';
import { PrivacyPolicyComponent } from './privacy-policy.component';

export const PRIVACY_POLICY_ROUTES: Routes = [
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    resolve: { document: PrivacyPolicyResolver }
  }
];
