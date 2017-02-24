import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { GalleryViewStore } from './gallery-view.store';
import { Gallery, GalleryPath } from '../gallery-view.interface';

@Injectable()
export class GalleryViewService {
  constructor(private store: GalleryViewStore) { }

  public get data(): Observable<Gallery> {
    return this.store.data;
  }

  public get state(): Gallery {
    return this.store.state;
  }

  public load(path: GalleryPath): Observable<Gallery> {
    this.store.replaceWith(JSON.parse(this.selectFakeResponseFor(path.length)).results, path);

    return Observable.of({ results: [] });
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
            "hasMore": true,
            "children": [
              {
                "id": 3,
                "name": "Day 1",
                "resultCount": 17,
                "thumbUrl": "http://www.masters.com/images/pics/large/h_2016040700348.jpg",
                "hasMore": true
              },
              {
                "id": 3,
                "name": "Day 2",
                "resultCount": 32,
                "thumbUrl": "http://www.masters.com/images/pics/large/h_2016040809705.jpg",
                "hasMore": true
              },
              {
                "id": 3,
                "name": "Day 3",
                "resultCount": 41,
                "thumbUrl": "http://www.masters.com/images/pics/large/h_2016040910496.jpg",
                "hasMore": true
              },
              {
                "id": 3,
                "name": "Day 4",
                "resultCount": 12,
                "thumbUrl": "http://mastersprogressivedl.edgesuite.net/2016/thumbnails/LDR_2016_r4_34046_2_492x277.jpg",
                "hasMore": true
              },
              {
                "id": 3,
                "name": "Day 5",
                "resultCount": 0,
                "thumbUrl": "http://www.masters.com/images/pics/large/h_2016040910496.jpg",
                "hasMore": true
              },
              {
                "id": 3,
                "name": "Day 6",
                "resultCount": 0,
                "thumbUrl": "http://www.masters.com/images/pics/large/h_2016040809705.jpg",
                "hasMore": true
              },
              {
                "id": 3,
                "name": "Day 7",
                "resultCount": 0,
                "thumbUrl": "http://www.masters.com/images/pics/large/h_2016041038412.jpg",
                "hasMore": true
              }
            ]
          },
          {
            "id": 5,
            "name": "Press Packets",
            "resultCount": 4,
            "hasMore": true,
            "children": [
              {
                "id": 6,
                "name": "Day 1",
                "resultCount": 4,
                "thumbUrl": "https://cdnt3m-a.akamaihd.net/tem/warehouse/186/234/7/1862347_038_lt.jpg",
                "hasMore": true
              },
              {
                "id": 6,
                "name": "Day 2",
                "resultCount": 3,
                "thumbUrl": "https://cdnt3m-a.akamaihd.net/tem/warehouse/186/543/186543_003_lt.jpg",
                "hasMore": true
              },
              {
                "id": 6,
                "name": "Day 3",
                "resultCount": 4,
                "thumbUrl": "https://cdnt3m-a.akamaihd.net/tem/warehouse/186/212/6/1862126_026_lt.jpg",
                "hasMore": true
              },
              {
                "id": 6,
                "name": "Day 4",
                "resultCount": 4,
                "thumbUrl": "https://cdnt3m-a.akamaihd.net/tem/warehouse/186/MVF/K/186MVFK_060_lt.jpg",
                "hasMore": true
              },
              {
                "id": 6,
                "name": "Day 5",
                "resultCount": 0,
                "thumbUrl": "https://cdnt3m-a.akamaihd.net/tem/warehouse/186/543/186543_003_lt.jpg",
                "hasMore": true
              },
              {
                "id": 6,
                "name": "Day 6",
                "resultCount": 0,
                "thumbUrl": "https://cdnt3m-a.akamaihd.net/tem/warehouse/186/543/186543_003_lt.jpg",
                "hasMore": true
              },
              {
                "id": 6,
                "name": "Day 7",
                "resultCount": 0,
                "thumbUrl": "https://cdnt3m-a.akamaihd.net/tem/warehouse/186/543/186543_003_lt.jpg",
                "hasMore": true
              }
            ]
          },
          {
            "id": 8,
            "name": "Promotional Content",
            "resultCount": 58,
            "hasMore": true,
            "children": [
              {
                "id": 9,
                "name": "Fly-overs",
                "resultCount": 18,
                "thumbUrl": "http://www.masters.com/images/pics/large/h_18rANGC15-1rb0278Hc.jpg",
                "hasMore": true
              },
              {
                "id": 9,
                "name": "Master Moments",
                "resultCount": 40,
                "thumbUrl": "http://www.masters.com/images/pics/large/h_masters64_palmeron18_angc_83123735_032011.jpg",
                "hasMore": true
              },
              {
                "id": 9,
                "name": "Course Scenics",
                "resultCount": 40,
                "thumbUrl": "https://cdnt3m-a.akamaihd.net/tem/warehouse/186/518/1/1865181_001_lt.jpg",
                "hasMore": true
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
            "hasMore": true
          },
          {
            "id": 4,
            "name": "Danny Willett",
            "resultCount": 2,
            "thumbUrl": "http://www.masters.com/images/players/2016/480x270/32139.jpg",
            "hasMore": true
          },
          {
            "id": 4,
            "name": "Rory McIlroy",
            "resultCount": 5,
            "thumbUrl": "http://www.masters.com/images/players/2016/480x270/28237.jpg",
            "hasMore": true
          },
          {
            "id": 4,
            "name": "Dustin Johnson",
            "resultCount": 4,
            "thumbUrl": "http://www.masters.com/images/players/2016/480x270/30925.jpg",
            "hasMore": true
          },
          {
            "id": 4,
            "name": "Bryson DeChambeau",
            "resultCount": 2,
            "thumbUrl": "http://www.masters.com/images/players/2016/480x270/47959.jpg",
            "hasMore": true
          },
          {
            "id": 4,
            "name": "Jason Day",
            "resultCount": 3,
            "thumbUrl": "http://www.masters.com/images/players/2016/480x270/28089.jpg",
            "hasMore": true
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
            "hasMore": false
          },
          {
            "id": 10,
            "name": "Drives",
            "resultCount": 2,
            "thumbUrl": "",
            "hasMore": false
          },
          {
            "id": 10,
            "name": "Putts",
            "resultCount": 5,
            "thumbUrl": "",
            "hasMore": false
          }
        ]
      }
    `;
  }
}
