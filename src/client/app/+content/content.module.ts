import { NgModule } from '@angular/core';
import { ContentComponent } from './content.component';
import { SharedModule } from '../shared/shared.module';
import {ContentService} from './content.service';

@NgModule({
    imports: [SharedModule.forRoot()],
    declarations: [ContentComponent],
    exports: [ContentComponent],
    providers: [ContentService],
})

export class ContentModule { }
