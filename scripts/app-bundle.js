define('app',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App() {
        }
        App.prototype.configureRouter = function (config, router) {
            this.router = router;
            config.title = 'Cyberball';
            config.options.pushState = true;
            config.options.root = '/osu-cyberball';
            config.map([
                { route: ['', 'home'], name: 'home', moduleId: 'pages/home' },
                { route: 'game', name: 'game', moduleId: 'pages/game' }
            ]);
        };
        return App;
    }());
    exports.App = App;
});
;
define('text!app.html',[],function(){return "<template>\n    <router-view></router-view>\n</template>\n";});;
define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});
;
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('main',["require", "exports", "./environment"], function (require, exports, environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    environment_1 = __importDefault(environment_1);
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        aurelia.use.developmentLogging(environment_1.default.debug ? 'debug' : 'warn');
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});
;
define('models/banter-model',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BanterModel = (function () {
        function BanterModel() {
        }
        return BanterModel;
    }());
    exports.BanterModel = BanterModel;
});
;
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('models/cpu-model',["require", "exports", "./player-model"], function (require, exports, player_model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CPUModel = (function (_super) {
        __extends(CPUModel, _super);
        function CPUModel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return CPUModel;
    }(player_model_1.PlayerModel));
    exports.CPUModel = CPUModel;
});
;
define('models/player-model',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PlayerModel = (function () {
        function PlayerModel() {
        }
        return PlayerModel;
    }());
    exports.PlayerModel = PlayerModel;
});
;
define('models/settings-model',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SettingsModel = (function () {
        function SettingsModel() {
        }
        return SettingsModel;
    }());
    exports.SettingsModel = SettingsModel;
});
;
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('pages/game',["require", "exports", "phaser"], function (require, exports, phaser_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    phaser_1 = __importDefault(phaser_1);
    function preload() {
        this.load.setBaseURL('http://labs.phaser.io');
        this.load.image('sky', 'assets/skies/space3.png');
        this.load.image('logo', 'assets/sprites/phaser3-logo.png');
        this.load.image('red', 'assets/particles/red.png');
    }
    function create() {
        this.add.image(400, 300, 'sky');
        this.add.image(400, 100, 'logo');
    }
    var GameViewModel = (function () {
        function GameViewModel() {
            this.gameConfig = {
                type: phaser_1.default.AUTO,
                width: 800,
                height: 600,
                scene: {
                    preload: preload,
                    create: create
                }
            };
        }
        return GameViewModel;
    }());
    exports.GameViewModel = GameViewModel;
});
;
define('text!pages/game.html',[],function(){return "<template>\n    <h1>Cyberball</h1>\n\n    <phaser-game config.bind=\"gameConfig\"></phaser-game>\n</template>\n";});;
define('pages/home',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HomeViewModel = (function () {
        function HomeViewModel() {
        }
        return HomeViewModel;
    }());
    exports.HomeViewModel = HomeViewModel;
});
;
define('text!pages/home.html',[],function(){return "<template>\n    <h1>Welcome to Cyberball</h1>\n</template>\n";});;
define('resources/index',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
        config.globalResources(aurelia_framework_1.PLATFORM.moduleName('./phaser-game/phaser-game'));
    }
    exports.configure = configure;
});
;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('resources/phaser-game/phaser-game',["require", "exports", "aurelia-framework", "phaser"], function (require, exports, aurelia_framework_1, phaser_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    phaser_1 = __importDefault(phaser_1);
    var PhaserGameCustomElement = (function () {
        function PhaserGameCustomElement(element) {
            this.element = element;
        }
        PhaserGameCustomElement.prototype.bind = function () {
            this.config.parent = this.element;
            this.game = new phaser_1.default.Game(this.config);
        };
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Object)
        ], PhaserGameCustomElement.prototype, "config", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", phaser_1.default.Game)
        ], PhaserGameCustomElement.prototype, "game", void 0);
        PhaserGameCustomElement = __decorate([
            aurelia_framework_1.customElement('phaser-game'),
            aurelia_framework_1.autoinject(),
            aurelia_framework_1.inlineView('<template></template>'),
            __metadata("design:paramtypes", [Element])
        ], PhaserGameCustomElement);
        return PhaserGameCustomElement;
    }());
    exports.PhaserGameCustomElement = PhaserGameCustomElement;
});
;
define('text!resources/phaser-game/phaser-game.html',[],function(){return "<template>\n    <div></div>\n</template>\n";});;
define('resources',['resources/index'],function(m){return m;});
//# sourceMappingURL=app-bundle.js.map