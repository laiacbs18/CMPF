import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from 'angular2/router';

import {NavbarComponent} from './core/navbar.component';
import {HomeComponent} from './views/home.component';
import {AboutUsComponent} from './views/about-us.component';
import {ManagementTeamComponent} from './views/management-team.component';
import {PhilosophicalFrameComponent} from './views/philosophical-frame.component';
import {DescriptionComponent} from './views/description.component';
import {NewsComponent} from './views/news.component';
import {ContactComponent} from './views/contact.component';

@Component({
    selector: 'my-app',
    directives: [ROUTER_DIRECTIVES, NavbarComponent],
    providers: [ROUTER_PROVIDERS],
    template: `
        <my-navbar></my-navbar>
        <div class="container">
            <router-outlet></router-outlet>
        </div>
    `
})
@RouteConfig([
    {path: '/', name: 'Home', component: HomeComponent, useAsDefault: true},
    {path: '/acerca-de-nosotros', name: 'AboutUs', component: AboutUsComponent},
    {path: '/marco-filosofico', name: 'PhilosophicalFrame', component: PhilosophicalFrameComponent},
    {path: '/equipo-gerencial', name: 'ManagementTeam', component: ManagementTeamComponent},
    {path: '/descripcion', name: 'Description', component: DescriptionComponent},
    {path: '/noticias-y-actividades', name: 'News', component: NewsComponent},
    {path: '/contacto', name: 'ContactUs', component: ContactComponent},
])
export class AppComponent { }