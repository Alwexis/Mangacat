import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { IonIcon, IonSearchbar, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDownOutline, chevronForwardOutline, funnelOutline } from 'ionicons/icons';
import { MangasService } from 'src/app/services/mangas.service';

@Component({
  selector: 'explore-slide',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
  standalone: true,
  imports: [RouterOutlet, RouterLink, FormsModule, IonSearchbar, IonIcon, IonSelect, IonSelectOption]
})
export class ExploreComponent  implements OnInit {

  loaded = {
    tags: false,
    mangas: false
  }
  tags: any;
  mangas: any;
  filter = {
    name: '',
  }

  constructor(private _mangasSrv: MangasService) {
    addIcons({ chevronDownOutline, chevronForwardOutline, funnelOutline })
  }

  async ngOnInit() {
    this.tags = await this._mangasSrv.getTags();
    this.loaded.tags = true;
    const mangas = await this._mangasSrv.customRequest('https://api.mangadex.org/manga?limit=32&offset=0&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&includedTagsMode=AND&excludedTagsMode=OR');
    this.mangas = await mangas.data.map((manga: any) => {
      let img = '';
      manga.relationships.forEach((rel: any) => {
        if (rel.type === 'cover_art') {
          img = rel.attributes.fileName;
        }
      });
      return { ...manga, cover_art: img };
    });
    this.loaded.mangas = true;
  }

  /*
  * Please future me, finish this function asap, remember filters left to implement:
  * - Tags
  * - Content Rating
  * - Demographic
  * - Status
  */
  async filterMangas() {
    this.loaded.mangas = false;
    let base_url = 'https://api.mangadex.org/manga?limit=32&offset=0&includes[]=cover_art'
    if (this.filter.name != '') {
      base_url += `&title=${encodeURIComponent(this.filter.name)}`;
    }
    const mangas = await this._mangasSrv.customRequest(base_url);
    this.mangas = mangas.data.map((manga: any) => {
      let img = '';
      manga.relationships.forEach((rel: any) => {
        if (rel.type === 'cover_art') {
          img = rel.attributes.fileName;
        }
      });
      return { ...manga, cover_art: img };
    });
    this.loaded.mangas = true;
  }

  displayFilters(e: any) {
    let parent = e.target.parentElement;
    while (!parent.classList.contains('group')) {
      parent = parent.parentElement;
    }
    parent.setAttribute('aria-expanded', parent.getAttribute('aria-expanded') == 'true' ? 'false' : 'true');
    let icon = parent.querySelector('.arrow-icon');
    icon.setAttribute('name', icon.getAttribute('name') == 'chevron-forward-outline' ? 'chevron-down-outline' : 'chevron-forward-outline');
  }
}
