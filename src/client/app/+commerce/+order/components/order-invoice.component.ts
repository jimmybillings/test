import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Order } from '../../../shared/interfaces/cart.interface';

@Component({
  moduleId: module.id,
  selector: 'order-invoice',
  template: '<button md-button class="is-outlined mini" color="primary" (click)="displayInvoice()">View Invoice</button>',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class OrderInvoiceComponent {
  @Input() order: Order;

  public displayInvoice() {

    let popupWinindow = window.open('', '_blank');
    popupWinindow.document.open();
    popupWinindow.document.write(
      `<html>
        <head>
        </head>
        ${this.text(this.order)}
        </html>`);
  }

  private text(order: any) {
    return `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Invoice</title>
          <style>${this.styles()}</style>
        </head>
        <body>
          <header>
            <h1>Invoice</h1>
            <address>
              <p>Jonathan Neal</p>
              <p>101 E. Chapman Ave<br>Orange, CA 92866</p>
              <p>(800) 555-1234</p>
            </address>
            
          </header>
          <article>
            <address>
              <p>Some Company<br>c/o Some Guy</p>
            </address>
            <table class="meta">
              <tr>
                <th><span>Invoice #</span></th>
                <td><span>${order.id}</span></td>
              </tr>
              <tr>
                <th><span>Date</span></th>
                <td><span>${order.createdOn}</span></td>
              </tr>
              <tr>
                <th><span>Amount Due</span></th>
                <td><span id="prefix">$</span><span>${order.paymentBalance}</span></td>
              </tr>
            </table>
            
            ${this.projectsAndAssets()}
            ${this.paymentSummary()}
          </article>
        </body>
      </html>
    `;
  }

  private projectsAndAssets() {
    let text: any = '';
    this.order.projects.forEach(project => {
      text += '<table><tr>';
      text += '<td>Project Name: ' + project.name + '</td>';
      text += '<td>Client Name: ' + project.clientName + '</td>';
      text += '<td>Subtotal: ' + project.subtotal + '</td>';
      text += '</tr></table>';
      text += '<table class="inventory"><thead><tr>';
      text += '<th><span>Product</span></th>';
      text += '<th><span>Rights</span></th>';
      text += '<th><span>Use</span></th>';
      text += '<th><span>Term</span></th>';
      text += '<th><span>Price</span></th>';
      text += '</tr></thead>';
      if (project.lineItems) {
        project.lineItems.forEach(item => {
          text += '<tr><td><span>' + item.asset.assetName + '</span></td>';
          text += '<td><span>' + item.rightsManaged + '</span></td>';
          text += '<td><span>' + item.attributes.filter(item => {
            return item.priceAttributeName === 'Project Type'
          }).map(item => {
            return item.selectedAttributeValue;
          })[0] + '</span></td>';
          text += '<td><span>' + item.attributes.filter(item => {
            return item.priceAttributeName === 'Term'
          }).map(item => {
            return item.selectedAttributeValue;
          })[0] + '</span></td>';
          text += '<td><span>$' + item.price + '</span></td></tr>';
        });
      }
      text += '</table>';
    });
    return text;
  }

  private paymentSummary() {
    return `
      <table class="balance">
        <tr>
          <th><span>Total</span></th>
          <td><span data-prefix>$</span><span>${this.order.total}</span></td>
        </tr>
        <tr>
          <th><span>Amount Paid</span></th>
          <td><span data-prefix>$</span><span>${this.order.total - this.order.paymentBalance}</span></td>
        </tr>
        <tr>
          <th><span>Balance Due</span></th>
          <td><span data-prefix>$</span><span>${this.order.paymentBalance}</span></td>
        </tr>
      </table>
    `;
  }

  private styles() {
    return `
      *
      {
        border: 0;
        box-sizing: content-box;
        color: inherit;
        font-family: inherit;
        font-size: inherit;
        font-style: inherit;
        font-weight: inherit;
        line-height: inherit;
        list-style: none;
        margin: 0;
        padding: 0;
        text-decoration: none;
        vertical-align: top;
      }

      /* heading */

      h1 { font: bold 100% sans-serif; letter-spacing: 0.5em; text-align: center; text-transform: uppercase; }

      /* table */

      table { font-size: 75%; table-layout: fixed; width: 100%; }
      table { border-collapse: separate; border-spacing: 2px; }
      th, td { border-width: 1px; padding: 0.5em; position: relative; text-align: left; }
      th, td { border-radius: 0.25em; border-style: solid; }
      th { background: #EEE; border-color: #BBB; }
      td { border-color: #DDD; }

      /* page */

      html { font: 16px/1 'Open Sans', sans-serif; overflow: auto; padding: 0.5in; }
      html { background: #999; cursor: default; }

      body { box-sizing: border-box; margin: 0 auto; overflow: hidden; padding: 0.5in; width: 8.5in; }
      body { background: #FFF; border-radius: 1px; box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5); }

      /* header */

      header { margin: 0 0 3em; }
      header:after { clear: both; content: ""; display: table; }

      header h1 { background: #000; border-radius: 0.25em; color: #FFF; margin: 0 0 1em; padding: 0.5em 0; }
      header address { float: left; font-size: 75%; font-style: normal; line-height: 1.25; margin: 0 1em 1em 0; }
      header address p { margin: 0 0 0.25em; }
      header span, header img { display: block; float: right; }
      header span { margin: 0 0 1em 1em; max-height: 25%; max-width: 60%; position: relative; }
      header img { max-height: 100%; max-width: 100%; }
      header input { 
        cursor: pointer; -ms-filter:"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)"; 
        height: 100%; left: 0; opacity: 0; position: absolute; top: 0; width: 100%; }

      /* article */

      article, article address, table.meta, table.inventory { margin: 0 0 3em; }
      article:after { clear: both; content: ""; display: table; }
      article h1 { clip: rect(0 0 0 0); position: absolute; }

      article address { float: left; font-size: 125%; font-weight: bold; }

      /* table meta & balance */

      table.meta, table.balance { float: right; width: 36%; }
      table.meta:after, table.balance:after { clear: both; content: ""; display: table; }

      /* table meta */

      table.meta th { width: 40%; }
      table.meta td { width: 60%; }

      /* table items */

      table.inventory { clear: both; width: 100%; }
      table.inventory th { font-weight: bold; text-align: center; }

      table.inventory td:nth-child(1) { width: 26%; }
      table.inventory td:nth-child(2) { width: 38%; }
      table.inventory td:nth-child(3) { text-align: left; width: 12%; }
      table.inventory td:nth-child(4) { text-align: left; width: 12%; }
      table.inventory td:nth-child(5) { text-align: right; width: 12%; }

      /* table balance */

      table.balance th, table.balance td { width: 50%; }
      table.balance td { text-align: right; }

      /* aside */

      aside h1 { border: none; border-width: 0 0 1px; margin: 0 0 1em; }
      aside h1 { border-color: #999; border-bottom-style: solid; }


      @media print {
        * { -webkit-print-color-adjust: exact; }
        html { background: none; padding: 0; }
        body { box-shadow: none; margin: 0; }
        span:empty { display: none; }
      }

      @page { margin: 0; }

    `;
  }
}
