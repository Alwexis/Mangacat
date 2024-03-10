import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-latest-updates',
  templateUrl: './latest-updates.page.html',
  styleUrls: ['./latest-updates.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LatestUpdatesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
