import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { CollectionsService } from '../../shared/services/collections.service';

@Injectable()
export class CollectionsResolver implements Resolve<boolean> {
  constructor(private collectionsService: CollectionsService) { }

  public resolve(): Observable<boolean> {
    if (this.collectionsService.state.items.length < 1) {
      this.collectionsService.load().subscribe();
    }

    return this.collectionsService.data.map(collections => collections.items.length > 0).filter(data => data).take(1);
  }
}
