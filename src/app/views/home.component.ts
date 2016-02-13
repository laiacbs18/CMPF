import { Component, OnInit } from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'my-home-view',
    directives: [ROUTER_DIRECTIVES],
    styles:[`
    #mainPage {
        text-align: center;
        color: #3366FF;
    }
    #card {
        padding-top: 20px;
    }
    `],
    template: `
        <div class="row" id="card">
            <div class="col-xs-12 col-lg-10 col-lg-offset-1">
                <div class="jumbotron wow fadeInUp" id="mainPage">
                    <h1>Centro Médico Padre Fantino</h1>
                    <img alt="portada" src="/img/cmp_edificio.jpg" />
                    <p>Unidos a ti desde antes de nacer</p>
                    <p>
                        <a [routerLink]="['AboutUs']" class="btn btn-primary btn-lg">Acerca de nosotros &raquo;</a>
                    </p>
                </div>
            </div>
        </div>
    `
})
export class HomeComponent { }
