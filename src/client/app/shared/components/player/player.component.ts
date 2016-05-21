import {Component, ChangeDetectionStrategy, Input, OnInit} from '@angular/core';
declare var PlayerApi: any, PlayerEnvironment: any;
/**
 * site header component - renders the header information
 */
@Component({
  selector: 'player',
  template: `
    <iframe 
      allowfullscreen="allowfullscreen" aria-hidden="true" 
      class="hide" data-player-loaded="false" height="100%" id="player" 
      itemallowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" width="100%">
    </iframe>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PlayerComponent implements OnInit {
  @Input() clip: string;
  public player: { load: any };

  ngOnInit() {
    this.player = new PlayerApi(document.querySelector('iframe#player'), { environment: PlayerEnvironment.PRODUCTION });
    this.player.load(this.clip, 'tem-r5tHustu');
  }

  // ngOnChanges(changes): void {
  //   console.log(changes.clip.currentValue);
  //   console.log(changes.clip);
  //   if (changes.clip && changes.clip.currentValue) this.player.load(changes.clip.currentValue, 'tem-r5tHustu');
  // }
}
