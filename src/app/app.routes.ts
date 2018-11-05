import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthorizatedGuardComponent } from './components/authorizated-guard/authorizated-guard.component';
import { FormularioComponent } from './components/formulario/formulario.component';
import { IndexComponent } from './components/index/index.component';
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
import { GestionarColeccionComponent } from './components/gestionar-coleccion/gestionar-coleccion.component';
import { ModificarArticuloComponent } from './components/modificar-articulo/modificar-articulo.component';
import { ListadoBarajasComponent } from './components/listado-barajas/listado-barajas.component';
import { CartasBarajaComponent } from './components/cartas-baraja/cartas-baraja.component';
import { ArquetipoComponent } from './components/arquetipo/arquetipo.component';
import { ContactosComponent } from './components/contactos/contactos.component';
import { ResultadosComponent } from './components/resultados/resultados.component';
import { MetajuegoComponent } from './components/metajuego/metajuego.component';

const appRoutes: Routes = [
  { path: 'index', component: IndexComponent },
  { path: 'formulario', component: FormularioComponent },
  { path: 'perfil', component: PerfilComponent, canActivate: [ AuthorizatedGuardComponent ] },
  { path: 'mazos', component: MazosComponent, canActivate: [ AuthorizatedGuardComponent ] },
  { path: 'torneos', component: TorneosComponent, canActivate: [ AuthorizatedGuardComponent ] },
  { path: 'torneos/:id', component: TorneosComponent, canActivate: [ AuthorizatedGuardComponent ] },
  { path: 'mensajes', component: MensajesComponent, canActivate: [ AuthorizatedGuardComponent ] },
  { path: 'enviados', component: EnviadosComponent, canActivate: [ AuthorizatedGuardComponent ] },
  { path: 'datosColeccion', component: DatosColeccionComponent, canActivate: [ AuthorizatedGuardComponent ] },
  { path: 'gestionarColeccion', component: GestionarColeccionComponent, canActivate: [ AuthorizatedGuardComponent ] },
  { path: 'correosEnviados/:id', component: CorreosEnviadosComponent, canActivate: [ AuthorizatedGuardComponent ] },
  { path: 'modificarArticulo/:id', component: ModificarArticuloComponent, canActivate: [ AuthorizatedGuardComponent ] },
  { path: 'recibidos/:id', component: RecibidosComponent, canActivate: [ AuthorizatedGuardComponent ] },
  { path: 'coleccion', component: ColeccionComponent, canActivate: [ AuthorizatedGuardComponent ] },
  { path: 'prestamos', component: PrestamosComponent, canActivate: [ AuthorizatedGuardComponent ] },
  { path: 'mail', component: MailComponent, canActivate: [ AuthorizatedGuardComponent ] },
  { path: 'home', component: HomeComponent, canActivate: [ AuthorizatedGuardComponent ] },
  { path: 'listadoBarajas/:id/:id2', component: ListadoBarajasComponent, canActivate: [ AuthorizatedGuardComponent ] },
  { path: 'cartasBaraja/:id/:id2/:id3', component: CartasBarajaComponent, canActivate: [ AuthorizatedGuardComponent ] },
  { path: 'arquetipo/:id/:id2', component: ArquetipoComponent, canActivate: [ AuthorizatedGuardComponent ] },
  { path: 'resultados/:id/:id2', component: ResultadosComponent, canActivate: [ AuthorizatedGuardComponent ] },
  { path: 'metajuego', component: MetajuegoComponent, canActivate: [ AuthorizatedGuardComponent ] },
  { path: 'metajuego/:id', component: MetajuegoComponent, canActivate: [ AuthorizatedGuardComponent ] },
  { path: 'contactos', component: ContactosComponent, canActivate: [ AuthorizatedGuardComponent ] },
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: '**', redirectTo: '/index'}
];

export const Routing = RouterModule.forRoot(appRoutes);
