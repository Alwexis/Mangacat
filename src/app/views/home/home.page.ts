import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSegmentButton, IonSegment, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logoGithub, logoLinkedin, logoTwitter, logoGoogle, arrowForward, people, time } from 'ionicons/icons';
import { ExploreComponent } from 'src/app/components/explore/explore.component';
import { HomeComponent } from 'src/app/components/home/home.component';
import { SwiperContainer } from 'swiper/element';

@Component({
  selector: 'home-tab',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [HomeComponent, ExploreComponent, IonIcon, IonSegmentButton, IonSegment, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePage implements AfterViewInit {

  @ViewChild('Swiper') swiper!: ElementRef<SwiperContainer>;
  @ViewChild('Segment') segmentEl: any;
  activeView: string = 'home';

  constructor() {
    addIcons({ logoGithub, logoLinkedin, logoTwitter, logoGoogle, arrowForward, people, time });
  }

  ngAfterViewInit(): void {
    this.swiper.nativeElement.addEventListener('swiperslidechange', (e: any) => {
      if (e.target.id === 'main-swiper') {
        this.segmentEl.el.value = this.swiper.nativeElement.swiper.isBeginning ? 'home' : 'explore';
        this.activeView = this.swiper.nativeElement.swiper.isBeginning ? 'home' : 'explore';
      }
    });
  }

  changeSlide() {
    this.swiper.nativeElement.swiper.isBeginning ? this.swiper.nativeElement.swiper.slideNext(100, true) : this.swiper.nativeElement.swiper.slidePrev(100, true);
  }
}
