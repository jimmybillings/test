// import { ReflectiveInjector } from '@angular/core';
// import { Http, HTTP_PROVIDERS, Headers } from '@angular/http';
// import { FormControl, AsyncValidatorFn } from '@angular/forms';
import { FormControl } from '@angular/forms';
// import { CollectionsService } from '../../../../+collection/services/collections.service';
// import { Collections } from '../../../../shared/interfaces/collection.interface';
// import { Observable } from 'rxjs/Rx';
// import 'rxjs/Rx';


export interface ValidationResult {
  [key: string]: boolean;
}

// export class WzCollectionValidator {
//   protected static checkCollectionName(control: FormControl): ValidationResult {

//     return sCollectionNameIsTaken(control);
//   }

//   constructor(
//     public collectionsService: CollectionsService) {
//   }

//   private collectionNameIsTaken(control: FormControl, names:Array<string>): ValidationResult {

//     let collectionNames = ['Machu Picchu', 'Maui Hawaii', 'Maui Hawaii testing', 'mountain lions', 'mooze'];
//     let testCollections = this.collectionsService.getCollectionNamesforOwner().take(1).subscribe();

//     console.log(testCollections);
//     if (collectionNames.indexOf(control.value) > -1) {
//       console.log(control);
//       return { 'collectionNameTaken': true };
//     } else {
//       return null;
//     }
//   }
// }


// export class WzCollectionValidator {
//   protected static checkCollectionName(control: FormControl): ValidationResult {

//     return sCollectionNameIsTaken(control);
//   }

//   constructor(
//     public collectionsService: CollectionsService) {
//   }

// private collectionNameIsTaken(control: FormControl): ValidationResult {

// let collectionNames = ['Machu Picchu', 'Maui Hawaii', 'Maui Hawaii testing', 'mountain lions', 'mooze'];
// let testCollections = this.collectionsService.getCollectionNamesforOwner().take(1).subscribe();

// console.log(testCollections);
// if (collectionNames.indexOf(control.value) > -1) {
//   console.log(control);
//   return { 'collectionNameTaken': true };
// } else {
//   return null;
// }
//     this.collectionsService.getCollectionNamesforOwner().take(1).subscribe(data => {
//       let names = data.items.find(c => {
//         return c.name === control.value;
//       });
//       console.log(names);
//       console.log(control.value);
//       if (names !== undefined) {
//         return { 'collectionNameTaken': true };
//       } else {
//         return null;
//       }
//     });
// }













// export class validate {

//   constructor(
//     public collectionsService: CollectionsService) {
//   }

//   public nameIsTaken(control: FormControl): ValidationResult {

//     let collectionNames = ['Machu Picchu', 'Maui Hawaii', 'Maui Hawaii testing', 'mountain lions', 'mooze'];
//     this.collectionsService.getCollectionNamesforOwner().take(1).subscribe(data => {
//       console.log(data);

//     });

//     console.log(testCollections);
//     if (collectionNames.indexOf(control.value) > -1) {
//       console.log(control);
//       return { 'collectionNameTaken': true };
//     } else {
//       return null;
//     }
//   }
// }


// function sCollectionNameIsTaken(control: FormControl): ValidationResult {
//   let collectionNames = ['Machu Picchu', 'Maui Hawaii', 'Maui Hawaii testing', 'mountain lions', 'mooze'];
//   if (collectionNames.indexOf(control.value) > -1) {
//     console.log(control);
//     console.log(collectionNames);
//     return { 'collectionNameTaken': true };
//   } else {
//     return null;
//   }
// }





// export class WzCollectionValidator {
//   static checkCollectionName(control: FormControl): any {
//     let injector = ReflectiveInjector.resolveAndCreate([HTTP_PROVIDERS]);
//     let http = injector.get(Http);

//     let apiUrl = 'https://crxextapi.dev.wzplatform.com/api/assets/v1/search/collectionSummary/fetchBy?access-level=owner&i=0&n=2000';
//     let headers = new Headers({
//       'Content-Type': 'application/json',
//       'Accept': 'application/json',
//       'Authorization': 'Bearer ' + localStorage.getItem('token')
//     });


//     return new Observable((obs: any) => {
//       control.valueChanges
//       .debounceTime(600)
//       .distinctUntilChanged()
//       .map(term => http.get(apiUrl, headers))
//       .subscribe(data => {
//         console.log(data);
//         let d = data;
//         let reason = 'collectionNameTaken';
//         let names = d.items.find(c => {
//           return c.name === control.value;
//         });
//         console.log(names);
//         console.log(control.value);
//         if (names !== undefined) {
//           obs.next(null);
//           obs.complete();
//         } else {
//           obs.next({[reason]: true });
//           obs.complete();
//         }
//       });
//     });
//   }
// }





// export class WzCollectionValidator {
//   static checkCollectionName(control: FormControl): Promise<ValidationResult> {
//     let injector = ReflectiveInjector.resolveAndCreate([HTTP_PROVIDERS]);
//     let http = injector.get(Http);
//     let apiUrl = 'https://crxextapi.dev.wzplatform.com/api/assets/v1/search/collectionSummary/fetchBy?access-level=owner&i=0&n=2000';
//     let headers = new Headers({
//       'Content-Type': 'application/json',
//       'Accept': 'application/json',
//       'Authorization': 'Bearer ' + localStorage.getItem('token')
//     });

//     return new Promise(resolve => {
//       // resolve(null);
//       http.get(apiUrl, { headers: headers })
//         .map(res => res.json())
//         .subscribe(data => {
//           let names = data.items.find(c => {
//             return c.name === control.value;
//           });
//           console.log(names);
//           console.log(control.value);

//           if (names !== undefined) {
//             resolve({ 'collectionNameTaken': true });
//           } else {
//             resolve(null);
//           }
//         });
//       return resolve;  
//     });
//   }
// }






// interface IHasMemberFunction {
//   getOwnedCollections(): void;
// }

export class WzCollectionValidator {
  // public ownedCollections: Collections;

  // static checkCollectionName(control: FormControl, ownerCollections:IHasMemberFunction): ValidationResult {
  static checkCollectionName(control: FormControl): ValidationResult {
    let collectionNames = ['Machu Picchu', 'Maui Hawaii', 'Maui Hawaii testing', 'mountain lions', 'mooze'];
    // let collectionsTest = ownerCollections.getOwnedCollections();
    // console.log(collectionsTest);
    if (collectionNames.indexOf(control.value) > -1) {
      console.log(control);
      return { 'collectionNameTaken': true };
    } else {
      return null;
    }
  }

  // constructor(
  //   public collectionsService: CollectionsService) {
  // }

  // public getOwnedCollections(): Collections {
  //   this.collectionsService.getCollections('owner', 4000).take(1).subscribe(c => {
  //     this.ownedCollections =  c;
  //   });
  //   console.log(this.ownedCollections);
  //   return this.ownedCollections;
  // }
}
