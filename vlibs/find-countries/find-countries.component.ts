import {
  Component,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import {
  SlRouterService,
  SLBackAction
} from '@virtwoo/sl-router';

import {
  COUNTRIES_CODES_DATA,
  Country
} from './countries.data';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'find-countries',
  templateUrl: './find-countries.component.html',
  styleUrls: ['./find-countries.component.scss'],
})
export class FindCountriesComponent implements OnInit {

  @Output()
  public closed = new EventEmitter<Country>();

  public countries = COUNTRIES_CODES_DATA;
  public lang: string;

  constructor(
    private translateService: TranslateService,
    private slRouterService: SlRouterService
  ) { }

  public ngOnInit(): void {
    this.lang = this.translateService.getDefaultLang() || 'en';
    this.slRouterService.push(this.close);
  }

  public close: SLBackAction = () => {
    this.closed.emit(null);

    return false;
  }

  public searchCountry(value: string): void {
    if (value && value.trim() === '') {
      this.countries = COUNTRIES_CODES_DATA;
    } else {
      value = value.trim().toLowerCase();

      this.countries = COUNTRIES_CODES_DATA.filter(country => {
        const nameCountry = country.lang[this.lang]
          .trim()
          .toLowerCase() as string;

        return nameCountry.search(value) > -1;
      });
    }
  }

  public selectCountry(country: Country): void {
    this.closed.emit(country);
  }

}
