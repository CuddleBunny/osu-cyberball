define('app',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App() {
        }
        App.prototype.configureRouter = function (config, router) {
            this.router = router;
            config.title = 'Cyberball';
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
define('helpers',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function getCaughtBallPosition(player) {
        return { x: player.x + (player.flipX ? -50 : 50), y: player.y - 15 };
    }
    exports.getCaughtBallPosition = getCaughtBallPosition;
    function getActiveBallPosition(player) {
        return { x: player.x + (player.flipX ? 40 : -40), y: player.y - 20 };
    }
    exports.getActiveBallPosition = getActiveBallPosition;
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
define('pages/game',["require", "exports", "phaser", "helpers"], function (require, exports, phaser_1, helpers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    phaser_1 = __importDefault(phaser_1);
    var gameWidth = 800;
    var gameHeight = 440;
    var playerGroup;
    var playerSprite;
    var ballSprite;
    var throwTarget;
    var playerHasBall = true;
    var ballHeld = true;
    var playerPosition = new phaser_1.default.Geom.Point(400, 250);
    var cpuPositions = [
        new phaser_1.default.Geom.Point(150, 100),
        new phaser_1.default.Geom.Point(650, 100)
    ];
    var config = {
        cpuCount: 2
    };
    function preload() {
        this.load.image('ball', './assets/ball.png');
        this.load.multiatlas('player', './assets/player.json', 'assets');
    }
    function create() {
        var _this = this;
        this.cameras.main.setBackgroundColor('#ffffff');
        this.anims.create({
            key: 'active',
            frames: this.anims.generateFrameNames('player', { start: 1, end: 1, prefix: 'active/', suffix: '.png' })
        });
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames('player', { start: 1, end: 1, prefix: 'idle/', suffix: '.png' })
        });
        this.anims.create({
            key: 'throw',
            frames: this.anims.generateFrameNames('player', { start: 1, end: 3, prefix: 'throw/', suffix: '.png' })
        });
        this.anims.create({
            key: 'catch',
            frames: this.anims.generateFrameNames('player', { start: 1, end: 1, prefix: 'catch/', suffix: '.png' }),
            frameRate: 4
        });
        playerGroup = this.physics.add.group({ immovable: true });
        playerSprite = playerGroup.create(playerPosition.x, playerPosition.y, 'player', 'active/1.png');
        var _loop_1 = function (i) {
            var cpuSprite = playerGroup.create(cpuPositions[i].x, cpuPositions[i].y, 'player', 'idle/1.png');
            cpuSprite.flipX = cpuPositions[i].x > playerPosition.x;
            cpuSprite.setInteractive();
            cpuSprite.on('pointerdown', function (e) {
                if (playerHasBall) {
                    playerHasBall = ballHeld = false;
                    throwTarget = cpuSprite;
                    playerSprite.play('throw');
                    playerSprite.anims.currentAnim.once('complete', function () { playerSprite.play('idle'); });
                    var ballTargetPosition = helpers_1.getCaughtBallPosition(cpuSprite);
                    _this.physics.moveTo(ballSprite, ballTargetPosition.x, ballTargetPosition.y, 500);
                }
            });
        };
        for (var i = 0; i < config.cpuCount; i++) {
            _loop_1(i);
        }
        var ballPosition = helpers_1.getActiveBallPosition(playerSprite);
        ballSprite = this.physics.add.image(ballPosition.x, ballPosition.y, 'ball');
        console.log(playerGroup);
        this.physics.add.overlap(ballSprite, playerGroup, function (ball, player) {
            if (!ballHeld && player === throwTarget) {
                ballHeld = true;
                if (player === playerSprite) {
                    playerHasBall = true;
                }
                player.play('catch');
                var ballPosition_1 = helpers_1.getCaughtBallPosition(player);
                ball.body.reset(ballPosition_1.x, ballPosition_1.y);
            }
        });
    }
    function update() {
        if (playerHasBall) {
            playerSprite.play('active');
            playerSprite.flipX = this.input.x < gameWidth / 2;
            var ballPosition = helpers_1.getActiveBallPosition(playerSprite);
            ballSprite.x = ballPosition.x;
            ballSprite.y = ballPosition.y;
        }
    }
    var GameViewModel = (function () {
        function GameViewModel() {
            this.gameConfig = {
                type: phaser_1.default.AUTO,
                width: gameWidth,
                height: gameHeight,
                scene: {
                    preload: preload,
                    create: create,
                    update: update
                },
                physics: {
                    default: 'arcade',
                    arcade: {
                        debug: true
                    }
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
define('resources',['resources/index'],function(m){return m;});
//# sourceMappingURL=app-bundle.js.map