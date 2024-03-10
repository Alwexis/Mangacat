import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MangasService {

  _tags: any = [];

  constructor(private _http: HttpClient) { }

  /*
  ? Lista de Mangas
    * const a = await fetch("https://api.mangadex.org/manga?limit=32&offset=0&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&includedTagsMode=AND&excludedTagsMode=OR", {
    *   "method": "GET",
    * })
  
  ? Info Manga por UUID
    * const a = await fetch("https://api.mangadex.org/manga/801513ba-a712-498c-8f57-cae55b38cc92?includes[]=artist&includes[]=author&includes[]=cover_art", {
    *   "method": "GET",
    * });
    
  ? Bypass CORS
    * const a = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://api.mangadex.org/manga/801513ba-a712-498c-8f57-cae55b38cc92?includes[]=artist&includes[]=author&includes[]=cover_art')}`)
  */

  async loadTags() {
    const base_url = "https://api.mangadex.org/manga/tag";
    const data: any = await firstValueFrom(this._http.get(base_url));
    this._tags = data['data'];
  }

  async getTags() {
    if (this._tags.length === 0) {
      await this.loadTags();
    }
    return this._tags;
  }

  async getTag(uuid: string) {
    if (this._tags.length === 0) {
      await this.loadTags();
    }
    return this._tags.filter((e: any) => e.id === uuid)[0];
  }

  async getManga(uuid: string) {
    // const base_url = encodeURI(`https://api.mangadex.org/manga/${uuid}?includes[]=artist&includes[]=author&includes[]=cover_art`);
    const base_url = encodeURIComponent(`https://api.mangadex.org/manga/${uuid}?includes[]=artist&includes[]=author&includes[]=cover_art`);
    const url = `https://api.allorigins.win/get?url=${base_url}`;
    const rawRes: any = await firstValueFrom(this._http.get(url));
    const res = JSON.parse(rawRes['contents']);
    let data = res['data'];
    let altTitles: any = {};
    for (let altTitle of data.attributes.altTitles) {
      let lang = Object.keys(altTitle)[0];
      altTitles[lang] = altTitle[lang];
    }
    let tags: any = {}
    for (let tag of data.attributes.tags) {
      if (!tags.hasOwnProperty(tag.attributes.group)) {
        tags[tag.attributes.group] = [];
      }
      tags[tag.attributes.group].push(tag);
    }
    data.attributes.categorizedTags = tags;
    data.attributes.normalizedCreatedAt = new Date(data.attributes.createdAt).toLocaleDateString().replace(/-/g, "/");
    data.attributes.altTitles = altTitles;
    let stats = await this.getMangaStats(uuid);
    data.stats = stats;
    return data;
  }

  async getMangaStats(uuid: string) {
    const base_url = encodeURIComponent(`https://api.mangadex.org/statistics/manga/${uuid}`);
    const url = `https://api.allorigins.win/get?url=${base_url}`;
    const rawRes: any = await firstValueFrom(this._http.get(url));
    const res = JSON.parse(rawRes['contents']);
    return res['statistics'][uuid];
  }

  async getMangaChapters(uuid: string, page: number = 1) {
    // page = 1 = latest chapters
    // "https://api.mangadex.org/manga/${uuid}/feed?translatedLanguage[]=en&translatedLanguage[]=es-la&limit=50&includes[]=scanlation_group&includes[]=user&order[volume]=desc&order[chapter]=desc&offset=0&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic"
    const base_url = encodeURIComponent(`https://api.mangadex.org/manga/${uuid}/feed?translatedLanguage[]=en&translatedLanguage[]=es&translatedLanguage[]=es-la&limit=50&includes[]=scanlation_group&includes[]=user&order[volume]=desc&order[chapter]=desc&offset=${50 * page - 50}&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic`);
    const url = `https://api.allorigins.win/get?url=${base_url}`;
    const rawRes: any = await firstValueFrom(this._http.get(url));
    const res = JSON.parse(rawRes['contents']);
    const commentaries = await this.getChaptersComments(res['data'].map((e: any) => e.id));
    res['data'].forEach((e: any) => {
      e.attributes.normalizedPublishAt = new Date(e.attributes.publishAt).toLocaleDateString().replace(/-/g, "/");
      e.commentaries = commentaries.statistics[e.id];
      const relations: any = {}
      e.relationships.forEach((r: any) => {
        if (!relations.hasOwnProperty(r.type)) {
          relations[r.type] = [r];
        } else {
          relations[r.type].push(r);
        }
      });
      e.relationships = relations;
    });
    return res;
  }

  collapseChapters(chapters: any) {
    // Chapters are array of objects. And are sorted by chapter
    let collapsedChapters: any = {};
    for (let chapter of chapters) {
      if (!collapsedChapters.hasOwnProperty(chapter.attributes.chapter)) {
        collapsedChapters[chapter.attributes.chapter] = [];
        collapsedChapters[chapter.attributes.chapter].push(chapter)
        // collapsedChapters[chapter.attributes.chapter][chapter.attributes.translatedLanguage] = chapter;
      } else if (collapsedChapters.hasOwnProperty(chapter.attributes.chapter) && !collapsedChapters[chapter.attributes.chapter].hasOwnProperty(chapter.attributes.translatedLanguage)) {
        // collapsedChapters[chapter.attributes.chapter][chapter.attributes.translatedLanguage] = chapter;
        collapsedChapters[chapter.attributes.chapter].push(chapter)
      }
    }
    return collapsedChapters;
  }

  async getChaptersComments(chapters: string[]) {
    let header = '';
    chapters.forEach((id: string) => {
      if (header === ''){
        header += `chapter[]=${id}`;
      } else {
        header += `&chapter[]=${id}`;
      }
    });
    const base_url = `https://api.mangadex.org/statistics/chapter?${header}`;
    const res: any = await firstValueFrom(this._http.get(base_url));
    return res;
  }

  async getChapter(uuid: string) {
    const url = `https://api.mangadex.org/at-home/server/${uuid}?forcePort443=false`
    const rawRes: any = await firstValueFrom(this._http.get(url));
    const manga_url = `https://api.mangadex.org/chapter/${uuid}?includes[]=scanlation_group&includes[]=manga&includes[]=user`
    const rawManga: any = await firstValueFrom(this._http.get(manga_url));
    const images: any = []
    const optimizedImages: any = []
    rawRes.chapter.data.forEach(async (rawImg: any) => {
      // hash/img_uuid
      let base_url = `https://uploads.mangadex.org/data/${rawRes.chapter.hash}/${rawImg}`;
      // let url = `https://corsproxy.io/?${encodeURIComponent(base_url)}`;
      // let img = await firstValueFrom(this._http.get(url));
      images.push(encodeURIComponent(base_url));
    });
    // rawRes.chapter.dataSaver.forEach(async (rawImg: any) => {
    //   // hash/img_uuid
    //   let base_url = `https://uploads.mangadex.org/data/${rawRes.chapter.hash}/${rawImg}`;
    //   let url = `https://api.allorigins.win/get?url=${encodeURI(base_url)}`;
    //   let img = await firstValueFrom(this._http.get(url));
    //   optimizedImages.push(img);
    // });
    const data = {
      hash: rawRes.chapter.hash,
      baseURL: rawRes.baseUrl,
      manga_info: rawManga.data,
      images: images,
      rawImages: rawRes.chapter.data,
      // images_optimized: optimizedImages,
      rawImages_optimized: rawRes.chapter.dataSaver
    }
    return data
  }

  async getMangas(limit: number, page: number) {
    const base_url = encodeURIComponent(`https://api.mangadex.org/manga?limit=${limit}&offset=${page * limit - limit}&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&includedTagsMode=AND&excludedTagsMode=OR`);
    // const base_url = encodeURI("https://api.mangadex.org/manga/801513ba-a712-498c-8f57-cae55b38cc92?includes[]=artist&includes[]=author&includes[]=cover_art")
    // console.log(base_url)
    const url = `https://api.allorigins.win/get?url=${base_url}`;
    const rawRes: any = await firstValueFrom(this._http.get(url));
    // console.log(rawRes);
    const res = JSON.parse(rawRes['contents']);
    return res;
  }

  async getLatests() {
    const url = `https://api.mangadex.org/chapter?includes[]=scanlation_group&translatedLanguage[]=en&translatedLanguage[]=es-la&translatedLanguage[]=es&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&order[readableAt]=desc&limit=64`
    const rawRes: any = await firstValueFrom(this._http.get(url));
    const res = rawRes['data']
    let latestChapters = [];
    let latestChaptersObj: any = {};
    let rawMangaIds = "";
    for (let _chapter of res) {
      let attributes = _chapter['attributes'];
      let relationships = _chapter['relationships'];
      let detectedID = _chapter['relationships'].filter((e: any) => {
        if (e['type'] == 'manga') {
          return e['id'];
        }
      })[0];
      let source = detectedID['id'];
      latestChaptersObj[source] = {
        attributes: attributes,
        relationships: relationships,
        chapter_id: _chapter['id']
      }
      if (rawMangaIds == "") {
        rawMangaIds += `ids[]=${detectedID['id']}`
      } else {
        rawMangaIds += `&ids[]=${detectedID['id']}`
      }
    }
    const newData: any = await firstValueFrom(this._http.get(`https://api.mangadex.org/manga?${rawMangaIds}&limit=100&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic&includes[]=cover_art`));
    //? URL
    //* https://mangadex.org/covers/{MANGAID}/{FILENAME}
    let dateFormat = new Intl.DateTimeFormat('es-ES', { day: '2-digit', 'month': '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false });
    for (let _manga of newData['data']) {
      let cover = _manga['relationships'].filter((e: any) => {
        if (e['type'] == 'cover_art') {
          return e['attributes']['fileName'];
        }
      })[0]['attributes']['fileName'];
      let uploatedDate = dateFormat.format(new Date(latestChaptersObj[_manga.id].attributes.updatedAt));
      latestChapters.push({
        manga: _manga,
        chapter: latestChaptersObj[_manga.id],
        cover: cover,
        uploatedDate: uploatedDate
      });
    }
    return latestChapters;
  }

  async getSeasonals() {
    const url = 'https://api.mangadex.org/list/1cc30d64-45c6-45a6-8c45-3771e1933b0f?includes[]=user';
    const rawRes: any = await firstValueFrom(this._http.get(url));
    let rawMangasIDs = "";
    for (let manga of rawRes['data']['relationships']) {
      if (manga.type == 'manga') {
        if (rawMangasIDs == "") {
          rawMangasIDs += `ids[]=${manga.id}`
        } else {
          rawMangasIDs += `&ids[]=${manga.id}`
        }
      }
    }
    const newData: any = await firstValueFrom(this._http.get(`https://api.mangadex.org/manga?${rawMangasIDs}&limit=100&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic&includes[]=cover_art`));
    let mangas = newData['data'].map((e: any) => {
      let cover = e['relationships'].filter((r: any) => {
        if (r['type'] == 'cover_art') {
          return r['attributes']['fileName'];
        }
      })[0]['attributes']['fileName'];
      return { ...e, cover: cover };
    });
    return { name: rawRes['data']['attributes']['name'], mangas };
  }

  async getRecentlyAdded(limit: number) {
    const url = `https://api.mangadex.org/manga?limit=${limit}&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&order[createdAt]=desc&includes[]=cover_art&availableTranslatedLanguage[]=en&availableTranslatedLanguage[]=es-la&availableTranslatedLanguage[]=es&hasAvailableChapters=true`
    const rawRes: any = await firstValueFrom(this._http.get(url));
    let mangas = rawRes['data'].map((e: any) => {
      let cover = e['relationships'].filter((r: any) => {
        if (r['type'] == 'cover_art') {
          return r['attributes']['fileName'];
        }
      })[0]['attributes']['fileName'];
      return { ...e, cover };
    });
    return mangas;
  }

  async customRequest(url: string) {
    const rawRes: any = await firstValueFrom(this._http.get(url));
    return rawRes;
  }
  /* Example of an URL query with filters
  ? Base URL
    * https://api.mangadex.org/manga?limit=32&offset=0&includes[]=cover_art
  ? Params
    * &contentRating[]=safe
    * &contentRating[]=suggestive
    * &contentRating[]=erotica
    * &title=Tokyo%20Ghoul
    * &includedTagsMode=AND
    * &excludedTags[]=5920b825-4181-4a17-beeb-9918b0ff7a30
    * &excludedTags[]=a3c67850-4684-404e-9b7f-c69850ee5da6
    * &excludedTagsMode=OR
  */
}
