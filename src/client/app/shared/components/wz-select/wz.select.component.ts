import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'wz-select',
  templateUrl: 'wz.select.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WzSelectComponent {
  @Input() options: Array<any>;
  @Input() trPrefix: string;
  @Output() selectOption: any = new EventEmitter();

  public onSelectOption(option: any): void {
    this.options = this.toggleOptions(option);
    this.selectOption.emit(this.selectedOption);
  }

  private toggleOptions(selectedOption: any): Array<any> {
    return this.options.map((option: any) => {
      option.selected = (option.name === selectedOption.name) ? true : false;
      return option;
    });
  }

  private get selectedOption(): any {
    let option = this.options.filter((option: any) => option.selected === true);
    return (option.length > 0) ? option[0] : this.options[0];
  }
}