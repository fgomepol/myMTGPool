import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, BaseRequestOptions } from '@angular/http';

import { AppComponent } from './app.component';
import { FormularioComponent } from './components/formulario/formulario.component';
import { IndexComponent } from './components/index/index.component';
import { HomeComponent } from './components/home/home.component';
import { AuthorizatedGuardComponent } from './components/authorizated-guard/authorizated-guard.component';
import { Routing } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StorageService } from './service/storage.service';
import { ColeccionComponent } from './components/coleccion/coleccion.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { MazosComponent } from './components/mazos/mazos.component';
import { TorneosComponent } from './components/torneos/torneos.component';
import { PrestamosComponent } from './components/prestamos/prestamos.component';
import { MensajesComponent } from './components/mensajes/mensajes.component';
import { MailComponent } from './components/mail/mail.component';
import { RecibidosComponent } from './components/recibidos/recibidos.component';
import { EnviadosComponent } from './components/enviados/enviados.component';
import { CorreosEnviadosComponent } from './components/correos-enviados/correos-enviados.component';
import { DatosColeccionComponent } from './components/datos-coleccion/datos-coleccion.component';
import { ChartsModule } from 'ng2-charts';
import { GestionarColeccionComponent } from './components/gestionar-coleccion/gestionar-coleccion.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingComponent } from './components/loading/loading.component';
import { ModalColeccionComponent } from './components/modal-coleccion/modal-coleccion.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { OptionComponent } from './components/shared/option/option.component';
import { ScriptsComponent } from './components/shared/scripts/scripts.component';
import { ModalTendenciaComponent } from './components/modal-tendencia/modal-tendencia.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TipoCartaPipe } from './pipes/tipo-carta.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { NoimagePipe } from './pipes/noimage.pipe';
import { ListadoBarajasComponent } from './components/listado-barajas/listado-barajas.component';
import { CartasBarajaComponent } from './components/cartas-baraja/cartas-baraja.component';
import { ArquetipoComponent } from './components/arquetipo/arquetipo.component';
import { ContactosComponent } from './components/contactos/contactos.component';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { MetajuegoComponent } from './components/metajuego/metajuego.component';
import { ModalCartaComponent } from './components/modal-carta/modal-carta.component';
import { SugerenciaInversionComponent } from './components/sugerencia-inversion/sugerencia-inversion.component';
import { ExcelService } from './service/excel.service';
import { QueTePrestanComponent } from './components/que-te-prestan/que-te-prestan.component';
import { PrestarCartasComponent } from './components/prestar-cartas/prestar-cartas.component';
import { MazosFavoritosComponent } from './components/mazos-favoritos/mazos-favoritos.component';
import { ModalModificaCartasComponent } from './components/modal-modifica-cartas/modal-modifica-cartas.component';
import { EditorMazosComponent } from './components/editor-mazos/editor-mazos.component';
import { CartasMazoComponent } from './components/cartas-mazo/cartas-mazo.component';

@NgModule({
  declarations: [
    AppComponent,
    FormularioComponent,
    IndexComponent,
    HomeComponent,
    AuthorizatedGuardComponent,
    ColeccionComponent,
    PerfilComponent,
    MazosComponent,
    TorneosComponent,
    PrestamosComponent,
    MensajesComponent,
    MailComponent,
    RecibidosComponent,
    EnviadosComponent,
    CorreosEnviadosComponent,
    DatosColeccionComponent,
    GestionarColeccionComponent,
    LoadingComponent,
    ModalColeccionComponent,
    NavbarComponent,
    OptionComponent,
    ScriptsComponent,
    ModalTendenciaComponent,
    TipoCartaPipe,
    SafeHtmlPipe,
    NoimagePipe,
    ListadoBarajasComponent,
    CartasBarajaComponent,
    ArquetipoComponent,
    ContactosComponent,
    ResultadosComponent,
    MetajuegoComponent,
    ModalCartaComponent,
    SugerenciaInversionComponent,
    QueTePrestanComponent,
    PrestarCartasComponent,
    MazosFavoritosComponent,
    ModalModificaCartasComponent,
    EditorMazosComponent,
    CartasMazoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    Routing,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ChartsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    NgbModule.forRoot()
  ],
  providers: [
    StorageService,
    ExcelService,
    AuthorizatedGuardComponent,
    BaseRequestOptions
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
