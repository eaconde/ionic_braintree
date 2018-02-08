import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {
  Braintree,
  ApplePayOptions,
  PaymentUIOptions,
  PaymentUIResult } from '@ionic-native/braintree';
import { HTTP } from '@ionic-native/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
    private braintree: Braintree,
    private http: HTTP) {

    this.initBraintree()
  }

  initBraintree() {
    const url: string = 'http://lvh.me:3001/client';
    this.http.get(url, {}, {})
      .then(data => {
        const client = JSON.parse(data.data)
        const BRAINTREE_TOKEN = client.client_token;

        const paymentOptions: PaymentUIOptions = {
          amount: '14.99',
          primaryDescription: 'Your product or service (per /item, /month, /week, etc)',
        };

        this.braintree.initialize(BRAINTREE_TOKEN)
          // .then(() => this.braintree.setupApplePay(appleOptions))
          .then(() => this.braintree.presentDropInPaymentUI(paymentOptions))
          .then((result: PaymentUIResult) => {
            if (result.userCancelled) {
              console.log("User cancelled payment dialog.");
            } else {
              console.log("User successfully completed payment!");
              console.log("Payment Nonce: " + result.nonce);
              console.log("Payment Result.", result);
            }
          })
      })
      .catch(error => {
        console.log('HTTP ERROR ::', JSON.stringify(error));
        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);
      });
  }

}
