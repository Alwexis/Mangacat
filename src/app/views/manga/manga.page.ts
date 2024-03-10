import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { MangasService } from 'src/app/services/mangas.service';
import { chevronBackOutline, chevronForwardOutline, chevronUpOutline, chevronDownOutline, calendarClearOutline, eyeOffOutline, personOutline, peopleOutline, bookOutline, chevronBack, starOutline, bookmarkOutline, chatboxEllipsesOutline, calendarOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Location } from '@angular/common';
import { Util } from 'src/app/classes/util';

@Component({
  selector: 'app-manga',
  templateUrl: './manga.page.html',
  styleUrls: ['./manga.page.scss'],
  standalone: true,
  imports: [RouterLink, RouterOutlet, IonicModule, CommonModule, FormsModule]
})
export class MangaPage implements OnInit {

  private _id: string = "";
  loaded: boolean = false;
  loadingChapters: boolean = true;
  manga: any;
  chapters: any;
  page: number = 1;
  lastPage: number = 999 ^ 9;
  lowest: number = 999 ^ 9;
  highest: number = 0;

  constructor(private _mangaSrv: MangasService, private _route: ActivatedRoute, private _loc: Location) {
    addIcons({ chevronBackOutline, chevronForwardOutline, chevronUpOutline, chevronDownOutline, calendarClearOutline, eyeOffOutline, personOutline, peopleOutline, bookOutline, chevronBack, starOutline, bookmarkOutline, chatboxEllipsesOutline, calendarOutline });
    this._route.params.subscribe((params: any) => {
      this._id = params.id;
    })
  }

  async ngOnInit() {
    this.manga = await this._mangaSrv.getManga(this._id);
    for (let _relationShip of this.manga.relationships) {
      if (_relationShip.type == "artist") {
        this.manga.artist = _relationShip;
      } else if (_relationShip.type == "author") {
        this.manga.author = _relationShip;
      } else if (_relationShip.type == "cover_art") {
        this.manga.cover_art = _relationShip;
      }
    }
    this.manga.attributes.publicationDemographic = this.manga.attributes.publicationDemographic ? Util.toCamelCase(this.manga.attributes.publicationDemographic) : 'Sin especificar';
    this.loaded = true;
    await this.loadData();
  }

  goBack() {
    this._loc.back();
  }

  format(n: any) {
    if (Number.isInteger(n)) return Util.formatNumber(n as number);
    return Util.toCamelCase(n as string);
  }

  expand(e: any) {
    let parent = e.target.parentElement;
    while (!parent.classList.contains('group')) {
      parent = parent.parentElement;
    }
    parent.setAttribute('aria-expanded', parent.getAttribute('aria-expanded') == 'true' ? 'false' : 'true');
    let icon = parent.querySelector('ion-icon');
    icon.setAttribute('name', icon.getAttribute('name') == 'chevron-down-outline' ? 'chevron-up-outline' : 'chevron-down-outline');
  }

  async loadData() {
    this.loadingChapters = true;
    await document.querySelector('ion-content')?.scrollToTop(500)
    let chapters = await this._mangaSrv.getMangaChapters(this._id, this.page);
    let collapsed = this._mangaSrv.collapseChapters(chapters['data']);
    this.chapters = { keys: Object.keys(collapsed).sort((a: any, b: any) => b - a), data: collapsed };
    this.lowest = Math.min(...Object.keys(this.chapters.data).map(Number));
    this.highest = Math.max(...Object.keys(this.chapters.data).map(Number));
    this.loadingChapters = false;
  }

  async nextPage() {
    if (this.page >= this.lastPage) return;
    this.page++;
    await this.loadData();
    if (this.chapters.keys.length == 0) {
      this.lastPage = this.page - 1;
      await this.prevPage();
    }
  }

  async prevPage() {
    if (this.page <= 1) return;
    this.page--;
    await this.loadData();
  }


}
