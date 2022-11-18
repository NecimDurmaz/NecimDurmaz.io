import { Timeline } from './timeline.model';

export class Ticket {
  // public get cocukUcret(): number {
  //   if(this.body!=undefined){

  //     if (this.body.VatandaslikZorunlulugu == true) {
  //       this.body._cocukUcret = this.body.cocukUcretTC;
  //       return this.body._cocukUcret as number;
  //     } else {
  //       this.body._cocukUcret = this.body.cocukUcretForeign;
  //       return this.body._cocukUcret as number;
  //     }
  //   }else return 0;
  // }

  // public get yetiskinUcret(): number {
  //   if(this.body!=undefined){

  //     if (this.body.VatandaslikZorunlulugu == true) {
  //       this.body._yetiskinUcret = this.body.yetiskinUcretTC;
  //       return this.body._yetiskinUcret as number;
  //     } else {
  //       this.body._yetiskinUcret = this.body.yetiskinUcretForeign;
  //       return this.body._yetiskinUcret as number;
  //     }
  //   }else return 0;
  // }

  constructor(
    public primaryKey?: string,
    public body?: {
      eventAdi?: string;
      eventDetayi?: string;
      biletTuru?: string;
      yetiskinUcretTC?: number;
      yetiskinUcretForeign?: number;
      cocukUcretTC?: number;
      cocukUcretForeign?: number;
      VatandaslikZorunlulugu?: boolean;
      eventsGeneralId?: string;
      urlLink?: string;
      yetiskinUcret?: number;
      cocukUcret?: number;
      eventInformation?: string;
      eventInformationShow?: boolean;
      timeLineShow?: boolean;
      timeLineDetail?: Timeline[];
    }
  ) {
    // this.body.VatandaslikZorunlulugu = false;
  }
}
// export class Timeline {
//   title: string;
//   date: string;
//   detail: string;
// }
