import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { Wink } from 'src/app/models/wink.model';
import { WinkService } from 'src/app/services/wink.service';
import { Item } from 'src/app/models/item.model';
import { ProfilesService } from 'src/app/services/profiles.service';
import { Section } from 'src/app/models/section.model';
import { RoutesAPP } from 'src/app/config/enums/routes/routesApp.enum';

@Component({
  selector: 'app-private-profiles',
  templateUrl: './private-profiles.page.html',
  styleUrls: ['./private-profiles.page.scss'],
})
export class PrivateProfilesPage implements OnInit {

  userWink: User;
  origin: string;
  wink: Wink;
  idWink: string;
  generalItems: Item[] = [];
  professionalItems: Item[] = [];
  personalItems: Item[] = [];
  items: any[] = [
    this.generalItems,
    this.personalItems,
    this.professionalItems
  ];
  sections: Section[] = [];
  urlPublic = '/' + RoutesAPP.BASE + '/' + RoutesAPP.PERFIL_PUBLICO;

  constructor(
    private route: ActivatedRoute,
    private winkService: WinkService,
    private profilesService: ProfilesService,
  ) {
    this.sections = this.profilesService.sections;
  }

  ngOnInit() {
    this.route.params
    .subscribe(
      async (params: Params) => {
        try {
          this.userWink = this.winkService.GetUser(params.idUser);
          this.idWink = params.idWink;
          this.origin = params.origin;
          const response: Item[] = await this.profilesService.GetPrivateItems(this.userWink._id, this.idWink);
          this.FiltreItems(response);
        } catch (err) {
          console.log('Error ngOnInit private profiles', err.message);
        }
      }
    );
  }

  private FiltreItems(items: Item[]) {
    items.forEach(
      (item: Item) => {
        (this.items[item.section.key - 1] as Item[]).push(item);
      }
    );
    this.SortItems();
  }

  private SortItems() {
    this.items.forEach(
      (items: Item[]) => {
        items = items.sort(
          (a: Item, b: Item) => {
            if (a.position < b.position) {
              return -1;
            } else if (a.position > b.position) {
              return 1;
            } else {
              return 0;
            }
          }
        );
      }
    );
  }

}
