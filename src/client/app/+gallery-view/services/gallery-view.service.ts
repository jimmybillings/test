import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

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

  public initialize(): void {
    this.store.initializeWith(JSON.parse(this.fakeLevelZeroResponse).results);
  }

  public select(breadcrumb: GalleryBreadcrumb): void {
    const response: string = this.state.breadcrumbs.length === 1 ? this.fakeLevelTwoResponse : this.fakeLevelThreeResponse;

    this.store.updateWith(JSON.parse(response).results, breadcrumb);
  }

  public jumpTo(index: number): void {
    let breadcrumbs = JSON.parse(JSON.stringify(this.state.breadcrumbs));
    breadcrumbs = breadcrumbs.slice(0, index + 1);

    this.store.replaceWith(JSON.parse(this.selectFakeResponseFor(index)).results, breadcrumbs);
  }

  public search(breadcrumb: GalleryBreadcrumb): void {
    const breadcrumbs = JSON.parse(JSON.stringify(this.state.breadcrumbs));
    breadcrumbs.shift();
    breadcrumbs.push(breadcrumb);

    alert(`TO BE IMPLEMENTED\nA search with "${this.stringifyBreadcrumbs(breadcrumbs)}" would have happened here`);
  }

  private stringifyBreadcrumbs(breadcrumbs: GalleryBreadcrumb[]): string {
    return breadcrumbs.map((breadcrumb: GalleryBreadcrumb) => this.stringifyBreadcrumb(breadcrumb)).join(',');
  }

  private stringifyBreadcrumb(breadcrumb: GalleryBreadcrumb): string {
    return breadcrumb.ids.map((id: number, index: number) => `${id}:'${breadcrumb.names[index]}'`).join(',');
  }

  private selectFakeResponseFor(index: number): string {
    switch (index) {
      case 0: return this.fakeLevelZeroResponse;
      case 1: return this.fakeLevelTwoResponse;
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
            "thumbUrl": "https://www.masters.com/images/players/2016/1596x668/12345.jpg",
            "hasChildren": true
          },
          {
            "id": 4,
            "name": "Danny Willett",
            "resultCount": 2,
            "thumbUrl": "https://www.masters.com/images/players/2016/1596x668/32139.jpg",
            "hasChildren": true
          },
          {
            "id": 4,
            "name": "Rory McIlroy",
            "resultCount": 5,
            "thumbUrl": "https://www.masters.com/images/players/2016/1596x668/67899.jpg",
            "hasChildren": true
          },
          {
            "id": 4,
            "name": "Tiger Woods",
            "resultCount": 4,
            "thumbUrl": "https://www.masters.com/images/players/2016/1596x668/98765.jpg",
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
