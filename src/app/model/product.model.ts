export class Product {
  constructor(
    public primaryKey?: string,
    public body?: {
      kullaniciAdSoyad?: string;
      kullaniciTelefon?: string;
      kullaniciEmail?: string;
      biletID?: number;
      biletAdi?: string;
      biletTuru?: string;
      tarih?: string;
      yetiskinSayisi?: number;
      cocukSayisi?: number;
      yetiskinUcret?: number;
      cocukUcret?: number;
      price?: number;
      mail?: string;
      eventId?: string;
      degerlendirmeDurum?: boolean;
      eventUrl?: string;
      PnrId?: number;
      paymentType?: string;
      cardNumber?: string;
    }
  ) {
    // this.body.yetiskinSayisi = 0;
    // this.body.cocukSayisi = 0;
    // this.body.price = 0;
  }
}
