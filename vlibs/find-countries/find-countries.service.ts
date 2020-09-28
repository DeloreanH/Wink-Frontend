import {
  Injectable,
  Injector,
  ApplicationRef,
  ComponentFactoryResolver
} from '@angular/core';
import { Observable } from 'rxjs';

import { FindCountriesComponent } from './find-countries.component';
import {
  Country,
  COUNTRIES_CODES_DATA
} from './countries.data';

@Injectable()
export class FindCountriesService {

  static SearchByPrefix(code: string): Country | null {
    return COUNTRIES_CODES_DATA.find(country => country.code === code);
  }

  constructor(
    private injector: Injector,
    private applicationRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  public launch(): Observable<any> {
    return new Observable(observer => {
      const findCountries = document.createElement('find-countries');
      const factory = this.componentFactoryResolver.resolveComponentFactory(FindCountriesComponent);
      const findCountriesComponentRef = factory.create(this.injector, [], findCountries);
      const closed = (isUnsubscribe: boolean) => {
        // document.body.removeChild(findCountries);
        this.applicationRef.detachView(findCountriesComponentRef.hostView);

        if (!isUnsubscribe) {
          observer.complete();
        }
      };

      this.applicationRef.attachView(findCountriesComponentRef.hostView);

      findCountriesComponentRef.instance.closed.subscribe((response: Country) => {
        if (response) {
          observer.next(response);
        }

        closed(false);
      });

      document.body.appendChild(findCountries);

      return {
        unsubscribe: () => {
          closed(true);
        }
      };
    });
  }

}
