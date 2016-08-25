import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'cart',
  templateUrl: 'cart.html'
})
export class CartComponent implements OnInit {
  // constructor() {}
  ngOnInit(): void {
    console.log('cart init');
  }
}
