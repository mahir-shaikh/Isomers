import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ism-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.styl']
})
export class MessagesComponent implements OnInit {

  constructor() {
    console.log('messages work!');
  }

  ngOnInit() {
  }

}
