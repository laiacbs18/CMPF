import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'my-navbar',
    styleUrls: ['styles/navbar.css'],
    directives: [ROUTER_DIRECTIVES],
    template: `
        <div class="navbar navbar-fixed-top">
            <div class="container">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a [routerLink]="['Home']" class="navbar-brand">CM Padre Fantino</a>
                </div>
                <div class="navbar-collapse collapse">
                    <ul class="nav navbar-nav">
                        <li>
                            <a [routerLink]="['Home']">Inicio</a>
                        </li>
                        <li class="dropdown">
                            <a href="" class="dropdown-toggle" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Acerca de nosotros</a>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                                <li>
                                    <a [routerLink]="['AboutUs']">Quiénes Somos</a>
                                </li>
                                <li>
                                    <a [routerLink]="['PhilosophicalFrame']">Marco Filosófico</a>
                                </li>
                                <li>
                                    <a [routerLink]="['ManagementTeam']">Equipo Gerencial</a>
                                </li>
                                <li>
                                    <a [routerLink]="['Description']">Descripción</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a [routerLink]="['News']">Noticias y Actividades</a>
                        </li>
                        <li>
                            <a [routerLink]="['ContactUs']">Contacto</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `
})
export class NavbarComponent { }