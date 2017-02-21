import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { GalleryViewStore } from './gallery-view.store';

@Injectable()
export class GalleryViewService {
  constructor(private store: GalleryViewStore) { }

  public get data(): Observable<any> {
    return this.store.data;
  }

  public get state(): any {
    return this.store.state;
  }

  public loadZero(): void {
    this.store.updateWith(JSON.parse(this.fakeLevelZeroResponse).results);
  }

  public loadTwo(): void {
    this.store.updateWith(JSON.parse(this.fakeLevelTwoResponse).results);
  }

  public search(parameters: string): void {
    alert(`TO BE IMPLEMENTED\nA search with '${parameters}' would have happened here`);
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
            "thumbUrl": "https://www.masters.com/images/players/2016/1596x668/12345.jpg",
            "hasChildren": false
          },
          {
            "id": 4,
            "name": "Danny Willett",
            "resultCount": 2,
            "thumbUrl": "https://www.masters.com/images/players/2016/1596x668/32139.jpg",
            "hasChildren": false
          },
          {
            "id": 4,
            "name": "Rory McIlroy",
            "resultCount": 5,
            "thumbUrl": "https://www.masters.com/images/players/2016/1596x668/67899.jpg",
            "hasChildren": false
          },
          {
            "id": 4,
            "name": "Tiger Woods",
            "resultCount": 4,
            "thumbUrl": "https://www.masters.com/images/players/2016/1596x668/98765.jpg",
            "hasChildren": false
          }
        ]
      }
    `;
  }
}
