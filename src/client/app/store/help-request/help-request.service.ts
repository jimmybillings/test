import { Injectable } from '@angular/core';

import { FutureApiService } from '../api/api.service';
import { Api } from '../../shared/interfaces/api.interface';

@Injectable()
export class HelpRequestService {
  constructor(private apiService: FutureApiService) { }
}
