import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  ActivatedRoute,
} from '@angular/router';

import { VirtwooAuthServerService } from '../../services';

@Component({
  selector: 'mp-virtwoo-change-password',
  templateUrl: './virtwoo-change-password.component.html',
  styleUrls: ['./virtwoo-change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtwooChangePasswordComponent {

  constructor(
    private virtwooAuthServerService: VirtwooAuthServerService,
    private activatedRoute: ActivatedRoute
  ) { }

  public submitted(event: any) {
    event.access_token = this.activatedRoute.snapshot.params.token;
    this.virtwooAuthServerService.changePassword(event)
      .subscribe();
  }

}
