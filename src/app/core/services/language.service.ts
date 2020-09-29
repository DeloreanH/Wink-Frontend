import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { TranslateService } from '@ngx-translate/core';
import { languageStorage } from 'src/app/common/constants/storage.constants';
import * as moment from 'moment';

export enum Language {
  ES = 'es',
  EN = 'en',
}

@Injectable({
  providedIn: 'root'
})

export class LanguageService {

  private lang: string;
  public languages: { value: string, description: string }[] = [
    { value: 'en', description: 'WINK.LANGUAGES.ENGLISH' },
    { value: 'es', description: 'WINK.LANGUAGES.SPANISH' },
  ];
  constructor(
    private storageService: StorageService,
    private translateService: TranslateService,
  ) { }

  async Init() {
    this.lang = this.storageService.apiLanguage;
    console.log(this.lang);
    if (this.lang) {
      this.DefaultLanguage(this.lang);
    } else {
      this.DefaultLanguage(Language.EN);
    }
  }

  DefaultLanguage(lang: string) {
    if (!lang) {
      return;
    }
    this.translateService.setDefaultLang(lang);
    this.ChangeLanguage(lang as Language);
  }

  ChangeLanguage(lang: Language) {
    try {
      this.translateService.use(lang).subscribe();
      StorageService.SetItem(languageStorage, lang);
      moment.locale(Language.EN);
      this.lang = lang;
    } catch (err) {
      console.log('ChangeLanguage Error', err);
    }
  }

  public get language() {
    return this.translateService.defaultLang;
  }
}
