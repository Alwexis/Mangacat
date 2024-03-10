import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-comunity',
  templateUrl: 'comunity.page.html',
  styleUrls: ['comunity.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class ComunityPage {
  constructor() {}
}
