import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, PickerController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { MangasService } from 'src/app/services/mangas.service';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { Location } from '@angular/common';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.page.html',
  styleUrls: ['./chapter.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ChapterPage implements OnInit {

  private _id: string = "";
  chapterData: any;
  data: any;
  loaded: boolean = false;
  actualPage: number = 1;

  constructor(private _route: ActivatedRoute, private _mangaSrv: MangasService, private _picker: PickerController,
    private _location: Location) {
    addIcons({ chevronBackOutline, chevronForwardOutline })
    this._route.params.subscribe((params: any) => {
      this._id = params.id;
    })
  }

  async ngOnInit() {
    this.data = await this._mangaSrv.getChapter(this._id);
    this.loaded = true;
  }

  interaction(e: any) {
    /*
    console.log('-------------------')
    console.log(e.clientX);
    console.log(e.x);
    console.log(e.screenX);
    console.log(e.pageX);
    console.log('-------------------')
    */
    if (e.clientX >= 240) {
      this.nextPage();
    }
    if (e.clientX <= 100) {
      this.prevPage();
    }
  }

  async choosePage() {
    const buttons = [];
    for (let i = 1; i <= this.data.images.length; i++) {
      buttons.push({
        text: `Página ${i}`,
        value: i
      })
    };
    const picker = await this._picker.create({
      columns: [
        {
          name: 'pagina',
          options: buttons,
          selectedIndex: this.actualPage - 1,
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: (value) => {
            this.actualPage = value.pagina.value;
          }
        }
      ],
      mode: 'ios'
    });
    await picker.present();
  }

  nextPage() {
    if (this.actualPage + 1 <= this.data.images.length) {
      this.actualPage++;
    }
  }

  prevPage() {
    if (this.actualPage - 1 > 0) {
      this.actualPage--;
    }
  }

  async goBack() {
    this._location.back();
  }

}
