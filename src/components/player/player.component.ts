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
  
  ngOnInit() {
    this.player = new PlayerApi(document.querySelector('iframe#player'), {environment: PlayerEnvironment.PRODUCTION});
  }
  
  ngOnChanges(changes): void {
    if (changes.clip && changes.clip.currentValue) this.player.load(changes.clip.currentValue, 'tem-r5tHustu');
  }
}
