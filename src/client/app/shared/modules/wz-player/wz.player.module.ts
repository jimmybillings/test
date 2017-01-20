import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { TranslateModule } from 'ng2-translate';

import { TimecodePipe } from './pipes/timecode.pipe';
import { WzPlayerComponent } from './components/wz-player/wz.player.component';
import { WzAdvancedPlayerComponent } from './components/wz-advanced-player/wz.advanced-player.component';
import { PlayerControlbarComponent } from './components/wz-advanced-player/controlbars/player-controlbar.component';
import { SubclipControlbarComponent } from './components/wz-advanced-player/controlbars/subclip-controlbar.component';
import { MarkersClearButtonComponent } from './components/wz-advanced-player/controls/markers-clear-button.component';
import { MarkersPlaybackButtonComponent } from './components/wz-advanced-player/controls/markers-playback-button.component';
import { MarkersSaveButtonComponent } from './components/wz-advanced-player/controls/markers-save-button.component';
import { MarkerSeekButtonComponent } from './components/wz-advanced-player/controls/marker-seek-button.component';
import { MarkerSetButtonComponent } from './components/wz-advanced-player/controls/marker-set-button.component';
import { MarkerTimeDisplayComponent } from './components/wz-advanced-player/controls/marker-time-display.component';
import { PlaybackToggleButtonComponent } from './components/wz-advanced-player/controls/playback-toggle-button.component';
import { TimeDisplayComponent } from './components/wz-advanced-player/controls/time-display.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule
  ],
  declarations: [
    TimecodePipe,
    WzPlayerComponent,
    WzAdvancedPlayerComponent,
    PlayerControlbarComponent,
    SubclipControlbarComponent,
    MarkersClearButtonComponent,
    MarkersPlaybackButtonComponent,
    MarkersSaveButtonComponent,
    MarkerSeekButtonComponent,
    MarkerSetButtonComponent,
    MarkerTimeDisplayComponent,
    PlaybackToggleButtonComponent,
    TimeDisplayComponent
  ],
  exports: [
    TimecodePipe,
    WzAdvancedPlayerComponent,
    WzPlayerComponent
  ]
})
export class WzPlayerModule { }
