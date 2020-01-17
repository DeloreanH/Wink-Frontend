import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { TranslateService } from '@ngx-translate/core';
import { languageStorage } from 'src/app/common/constants/storage.constants';
import { Globalization } from '@ionic-native/globalization/ngx';

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
    private globalization: Globalization,
  ) { }

  async Init() {
    this.lang = this.storageService.apiLanguage;
    if (this.lang) {
      this.DefaultLanguage(this.lang);
    } else {
      const preLang = await this.globalization.getPreferredLanguage();
      if (preLang && preLang.value) {
        this.DefaultLanguage(preLang.value.split('-')[0]);
      } else {
        this.DefaultLanguage(Language.EN);
      }
    }
  }

  DefaultLanguage(lang: string) {
    if (!lang) {
      return;
    }
    if (lang === 'es') {
      this.translateService.setDefaultLang('en');
      this.ChangeLanguage(Language.ES);
    } else {
      this.translateService.setDefaultLang('es');
      this.ChangeLanguage(Language.EN);
    }
  }

  ChangeLanguage(lang: Language) {
    try {
      this.translateService.use(lang);
      StorageService.SetItem(languageStorage, lang);
      this.lang = lang;
    } catch (err) {
      console.log('ChangeLanguage Error', err);
    }
  }

  public get language() {
    return this.lang;
  }
}
