import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { MangasService } from 'src/app/services/mangas.service';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'home-slide',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeComponent  implements OnInit {

  loaded: any = {
    latestChapters: false,
    recentlyAdded: false,
    seasonals: false,
  }
  latests: any[] = [];
  seasonals: any = {};
  recentlyAdded: any[] = [];

  constructor(private _mangasSrv: MangasService) { }

  async ngOnInit() {
    const _latests: any = await this._mangasSrv.getLatests();
    this.latests = _latests;
    this.loaded.latestChapters = true;
    
    const _seasonals: any = await this._mangasSrv.getSeasonals();
    this.seasonals = _seasonals;
    this.loaded.seasonals = true;
    
    const _recentlyAdded: any = await this._mangasSrv.getRecentlyAdded(13);
    this.recentlyAdded = _recentlyAdded;
    this.loaded.recentlyAdded = true;
  }

}
