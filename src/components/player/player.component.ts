import {Component, ChangeDetectionStrategy, Input} from 'angular2/core';
declare var PlayerApi, PlayerEnvironment;
/**
 * site header component - renders the header information
 */ 
@Component({
  selector: 'player',
  template: '<iframe allowfullscreen="allowfullscreen" aria-hidden="true" class="hide" data-player-loaded="false" height="100%" id="player" itemallowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" width="100%"></iframe>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class Player {
  @Input() clip: string;
  public player: {load};
  
  public play(clip) {
    this.clip = clip;
    this.player = new PlayerApi(document.querySelector('iframe#player'), {environment: PlayerEnvironment.PRODUCTION});
    this.player.load(this.clip, 'tem-r5tHustu');
  }
}
