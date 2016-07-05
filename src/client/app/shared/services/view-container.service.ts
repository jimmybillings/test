import { Injectable, ViewContainerRef } from '@angular/core';

@Injectable()
export class ViewContainerService {
  public vcRef: ViewContainerRef;

  public set(vcRef: ViewContainerRef): void {
    this.vcRef = vcRef;
  }

  public getRef(): ViewContainerRef {
    return this.vcRef;
  }
}
