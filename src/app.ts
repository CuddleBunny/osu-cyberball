import { RouterConfiguration, Router } from 'aurelia-router';

export class App {
    router: Router;

    configureRouter(config: RouterConfiguration, router: Router): void {
        this.router = router;

        config.title = 'Cyberball';
        config.options.pushState = true;
        config.options.root = '/';

        config.map([
            { route: ['', 'home'], name: 'home', moduleId: 'pages/home' },
            { route: 'game', name: 'game', moduleId: 'pages/game' }
        ]);
    }
}
