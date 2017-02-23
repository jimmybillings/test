import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { GalleryViewStore } from './gallery-view.store';
import { GalleryBreadcrumb } from '../gallery-view.interface';

@Injectable()
export class GalleryViewService {
  constructor(private store: GalleryViewStore) { }

  public get data(): Observable<any> {
    return this.store.data;
  }

  public get state(): any {
    return this.store.state;
  }

  public load(breadcrumbs: GalleryBreadcrumb[]): Observable<any> {
    this.store.replaceWith(JSON.parse(this.selectFakeResponseFor(breadcrumbs.length)).results, breadcrumbs);

    return Observable.of({ some: 'data' });
  }

  private selectFakeResponseFor(index: number): string {
    switch (index) {
      case 0: return this.fakeLevelZeroResponse;
      case 1: return this.fakeLevelTwoResponse;
      case 2: return this.fakeLevelThreeResponse;
    }

    return 'Wha??';
  }

  private get fakeLevelZeroResponse(): string {
    return `
      {
        "results": [
          {
            "id": 2,
            "name": "Highlights",
            "resultCount": 17,
            "hasChildren": true,
            "children": [
              {
                "id": 3,
                "name": "Day 1",
                "resultCount": 17,
                "thumbUrl": "https://cdnt3m-a.akamaihd.net/tem/warehouse/186/463/3/1864633_010_lt.jpg",
                "hasChildren": true
              },
              {
                "id": 3,
                "name": "Day 2",
                "resultCount": 0,
                "thumbUrl": "https://cdnt3m-a.akamaihd.net/tem/warehouse/186/463/3/1864633_009_lt.jpg",
                "hasChildren": true
              }
            ]
          },
          {
            "id": 5,
            "name": "Press Packets",
            "resultCount": 4,
            "hasChildren": true,
            "children": [
              {
                "id": 6,
                "name": "Day 1",
                "resultCount": 4,
                "thumbUrl": "https://cdnt3m-a.akamaihd.net/tem/warehouse/186/463/3/1864633_011_lt.jpg",
                "hasChildren": true
              },
              {
                "id": 6,
                "name": "Day 2",
                "resultCount": 0,
                "thumbUrl": "https://cdnt3m-a.akamaihd.net/tem/warehouse/186/463/3/1864633_012_lt.jpg",
                "hasChildren": true
              }
            ]
          },
          {
            "id": 8,
            "name": "Promotional Content",
            "resultCount": 58,
            "hasChildren": true,
            "children": [
              {
                "id": 9,
                "name": "Fly-overs",
                "resultCount": 18,
                "thumbUrl": "https://cdnt3m-a.akamaihd.net/tem/warehouse/186/463/3/1864633_110_lt.jpg",
                "hasChildren": true
              },
              {
                "id": 9,
                "name": "Master Moments",
                "resultCount": 40,
                "thumbUrl": "https://cdnt3m-a.akamaihd.net/tem/warehouse/186/463/3/1864633_111_lt.jpg",
                "hasChildren": true
              }
            ]
          }
        ]
      }
    `;
  }

  private get fakeLevelTwoResponse(): string {
    return `
      {
        "results": [
          {
            "id": 4,
            "name": "Jordan Spieth",
            "resultCount": 6,
            "thumbUrl": "http://www.masters.com/images/players/2016/480x270/34046.jpg",
            "hasChildren": true
          },
          {
            "id": 4,
            "name": "Danny Willett",
            "resultCount": 2,
            "thumbUrl": "http://www.masters.com/images/players/2016/480x270/32139.jpg",
            "hasChildren": true
          },
          {
            "id": 4,
            "name": "Rory McIlroy",
            "resultCount": 5,
            "thumbUrl": "http://www.masters.com/images/players/2016/480x270/28237.jpg",
            "hasChildren": true
          },
          {
            "id": 4,
            "name": "Dustin Johnson",
            "resultCount": 4,
            "thumbUrl": "http://www.masters.com/images/players/2016/480x270/30925.jpg",
            "hasChildren": true
          },
          {
            "id": 4,
            "name": "Bryson DeChambeau",
            "resultCount": 2,
            "thumbUrl": "http://www.masters.com/images/players/2016/480x270/47959.jpg",
            "hasChildren": true
          },
          {
            "id": 4,
            "name": "Jason Day",
            "resultCount": 3,
            "thumbUrl": "http://www.masters.com/images/players/2016/480x270/28089.jpg",
            "hasChildren": true
          }
        ]
      }
    `;
  }

  private get fakeLevelThreeResponse(): string {
    return `
      {
        "results": [
          {
            "id": 10,
            "name": "Tee offs",
            "resultCount": 6,
            "thumbUrl": "",
            "hasChildren": false
          },
          {
            "id": 10,
            "name": "Drives",
            "resultCount": 2,
            "thumbUrl": "",
            "hasChildren": false
          },
          {
            "id": 10,
            "name": "Putts",
            "resultCount": 5,
            "thumbUrl": "",
            "hasChildren": false
          }
        ]
      }
    `;
  }
}
