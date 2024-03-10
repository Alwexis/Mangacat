import { Component, EnvironmentInjector, OnInit, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircle, home, chatbubble } from 'ionicons/icons';
import { MangasService } from '../../services/mangas.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
  activeTab = 'home';

  constructor(private _mangasSrv: MangasService) {
    addIcons({ personCircle, home, chatbubble });
  }

  tabsChange(event: any) {
    this.activeTab = event.tab;
  }
}
