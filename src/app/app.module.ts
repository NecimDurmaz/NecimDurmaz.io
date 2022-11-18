import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ProductComponent } from './product/product-1/product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { TicketComponent } from './ticket/ticket-1/ticket.component';
import { HomeComponent } from './home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TextMaskModule } from 'angular2-text-mask';
import { UserComponent } from './user/user.component';
import { CommentsComponent } from './comments/comments.component';
import { ReservationComponent } from './reservation/reservation.component';
import { FooterComponent } from './footer/footer.component';
import { WebpageComponent } from './webpage/webpage.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { Product2Component } from './product/product-2/product2.component';
import { LoadingComponent } from './loading/loading-1/loading.component';
import { Loading2Component } from './loading/loading-2/loading2.component';
import { Product2Detail2ListComponent } from './product/product-2/product-detail-list/product2-detail2-list/product2-detail2.component';
import { CreditCardComponent } from './credit-card/credit-card.component';
import { ToastrModule } from 'ngx-toastr';
import { Product2Detail1ListComponent } from './product/product-2/product-detail-list/product2-detail1-list/product2-detail1-list.component';
import { TicketDetailComponent } from './admin/ticket-detail/ticket-detail.component';
import { TimelineComponent } from './admin/ticket-detail/timeline/timeline.component';
import { Loading3Component } from './loading/loading-3/loading3.component';
import { Loading4Component } from './loading/loading-4/loading4.component';
import { Loading5Component } from './loading/loading-5/loading5.component';
import { ProductMainComponent } from './product/product-main/product-main.component';
import { Ticket2Component } from './ticket/ticket2/ticket2.component';
import { TicketMainComponent } from './ticket/ticket-main/ticket-main.component';

const appRoutes: Routes = [
  { path: '', component: TicketComponent },
  // { path: 'home', component: HomeComponent },
  { path: 'reservation/:id', component: ReservationComponent },
  // { path: 'ticket', component: TicketComponent },
  { path: 'ticket', component: TicketMainComponent },
  // { path: 'ticket2', component: Ticket2Component },
  // { path: 'ticket/product', component: ProductComponent },
  // { path: 'ticket/product/:id', component: ProductComponent },
  // { path: 'ticket/product/:id', component: Product2Component },
  { path: 'ticket/product', component: ProductMainComponent },
  { path: 'ticket/product/:id', component: ProductMainComponent },
  // { path: 'ticket/product/:id', component: Product2Component },
  { path: 'ticket/comments/:id', component: CommentsComponent },
  { path: 'product', component: ProductComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user', component: UserComponent },
  { path: 'webPage', component: WebpageComponent },
  { path: 'webPage/:ad', component: WebpageComponent },
  { path: 'newDesign', component: Product2Component },
  { path: 'ticketdetail', component: TicketDetailComponent },
];

@NgModule({
  declarations: [
    ProductComponent,
    NavbarComponent,
    TicketComponent,
    HomeComponent,
    AdminComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    CommentsComponent,
    ReservationComponent,
    FooterComponent,
    WebpageComponent,
    Product2Component,
    LoadingComponent,
    Loading2Component,
    Product2Detail2ListComponent,
    CreditCardComponent,
    Product2Detail1ListComponent,
    TicketDetailComponent,
    TimelineComponent,
    Loading3Component,
    Loading4Component,
    Loading5Component,
    ProductMainComponent,
    Ticket2Component,
    TicketMainComponent,
  ],
  imports: [
    BrowserModule,
    MatNativeDateModule,
    TextMaskModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxQRCodeModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    MatDatepickerModule,

    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule, // for firestore
    ToastrModule.forRoot({ positionClass: 'toast-top-right' }),
  ],
  providers: [
    { provide: 'apiUrl', useValue: 'https://biletim.ersmedya.com:3000/' },
  ],
  bootstrap: [HomeComponent],
})
export class AppModule {}
