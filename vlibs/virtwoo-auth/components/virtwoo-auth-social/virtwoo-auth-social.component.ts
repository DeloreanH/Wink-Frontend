import {
  Component,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

import { SlRouterService } from '@virtwoo/sl-router';

import {
  VirtwooAuthFacebookService,
  VirtwooAuthGoogleService
} from '../../services';
import { VirtwooAuthPathName } from '../../virtwoo-auth-config.data';

type Field = 'google' | 'facebook' | 'sms';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'virtwoo-auth-social',
  templateUrl: './virtwoo-auth-social.component.html',
  styleUrls: ['./virtwoo-auth-social.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtwooAuthSocialComponent {

  @Input()
  public fields: Field[] = [];

  constructor(
    private virtwooAuthFacebookService: VirtwooAuthFacebookService,
    private virtwooAuthGoogleService: VirtwooAuthGoogleService,
    private slRouterService: SlRouterService
  ) { }

  public launch(
    provider: 'GOOGLE' | 'FACEBOOK' | 'SMS'
  ): void {
    switch (provider) {
      case 'SMS':
        this.slRouterService.push(VirtwooAuthPathName.Sms);
        break;
      case 'GOOGLE':
        this.google();
        break;
      case 'FACEBOOK':
        this.facebook();
        break;
    }
  }

  public isField(fiel: Field): boolean {
    return this.fields.indexOf(fiel) > -1;
  }

  private facebook(): void {
    this.virtwooAuthFacebookService.launch()
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );

  }

  private google(): void {
    
    this.virtwooAuthGoogleService.launch()
      .subscribe(
        (response) => {
          console.log('google', response);
          console.log(response);
        },
        (error) => {
          console.log('google', error);
          console.log(error);
        }
      );
  }

}
