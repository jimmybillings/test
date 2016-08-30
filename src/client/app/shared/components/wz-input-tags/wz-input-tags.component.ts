import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'wz-input-tags',
  template: `<div class="md-input-wrapper wz-tags">
                <ul *ngIf="tags.length > 0">
                  <li [ngClass]="{'ready-delete': checkBeforeDelete(tag)}" *ngFor="let tag of tags;">
                    {{tag}}
                    <a class="button delete" md-icon-button (click)="delete($event, tag)">
                      <md-icon>cancel</md-icon>
                    </a>
                  </li>
                </ul>
                <ng-content></ng-content>
             </div>`,
})

export class WzInputTagsComponent {
  @Input() fControl: FormControl;
  private tags: Array<string> = [];
  private finalDelete: boolean = false;

  public submit(e: any) {
    switch (e.code) {

      case 'Enter':
        let tag: string = e.target.value;
        if (!this.find(tag)) this.create(tag);
        e.target.value = '';
        e.preventDefault();
        return;

      case 'Backspace':
        if(e.target.value === '') {
          if (this.finalDelete) {
            this.delete(false, this.tags[this.tags.length - 1]);
          } else {
            this.finalDelete = true;
          }
        }
        return;

      default:
        this.finalDelete = false;
        return;
    }
  }

  public checkBeforeDelete(tag: string): boolean {
    return (this.finalDelete && this.tags[this.tags.length - 1] === tag);
  }

  private delete($event=false, tagForDelete: string) {
    this.tags = this.tags.filter((tag) => tag !== tagForDelete);
    this.fControl.updateValue(this.tags.toString());
    this.finalDelete = false;
  }

  private create(tag: string) {
    this.tags = this.tags.concat(tag);
    this.fControl.updateValue(this.tags.toString());
  }

  private find(tagCandidate: string): boolean {
    return this.tags.filter((tag) => tag === tagCandidate).length > 0;
  }
}
