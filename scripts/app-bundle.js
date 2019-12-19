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
        function CPUModel(init) {
            var _this = _super.call(this) || this;
            _this.targetPreference = [50, 50];
            _this.throwDelay = 500;
            _this.throwDelayVariance = 200;
            _this.catchDelay = 500;
            _this.catchDelayVariance = 200;
            Object.assign(_this, init);
            return _this;
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
define('models/settings-model',["require", "exports", "./player-model", "./cpu-model"], function (require, exports, player_model_1, cpu_model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SettingsModel = (function () {
        function SettingsModel(init) {
            this.player = new player_model_1.PlayerModel();
            this.throwCount = 10;
            this.ballSpeed = 500;
            this.useSchedule = false;
            this.scheduleHonorsThrowCount = false;
            this.schedule = [
                1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0
            ];
            this.baseUrl = './assets';
            this.ballSprite = 'ball.png';
            this.chatEnabled = false;
            Object.assign(this, init);
        }
        return SettingsModel;
    }());
    exports.SettingsModel = SettingsModel;
    exports.defaultSettings = new SettingsModel({
        player: {
            name: 'Player 1'
        },
        computerPlayers: [
            new cpu_model_1.CPUModel({
                name: 'Player 2'
            }),
            new cpu_model_1.CPUModel({
                name: 'Player 3'
            })
        ]
    });
});
;
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('pages/game',["require", "exports", "./../scenes/cyberball", "./../models/settings-model", "phaser"], function (require, exports, cyberball_1, settings_model_1, phaser_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    phaser_1 = __importDefault(phaser_1);
    var GameViewModel = (function () {
        function GameViewModel() {
            this.settings = settings_model_1.defaultSettings;
            this.chatMessages = [];
            this.gameWidth = 800;
            this.gameHeight = 460;
            this.gameConfig = {
                type: phaser_1.default.AUTO,
                width: this.gameWidth,
                height: this.gameHeight,
                scene: new cyberball_1.CyberballScene(settings_model_1.defaultSettings),
                physics: {
                    default: 'arcade',
                    arcade: {
                        debug: true
                    }
                }
            };
        }
        GameViewModel.prototype.sendMessage = function () {
            this.chatMessages.push({
                sender: this.settings.player.name,
                text: this.chatMessage
            });
            this.chatMessage = '';
        };
        return GameViewModel;
    }());
    exports.GameViewModel = GameViewModel;
});
;
define('text!pages/game.css',[],function(){return ".chat {\n\n}\n\n.chat-log {\n    border: 1px solid black;\n    border-bottom: 0;\n    height: 100px;\n    overflow-y: auto;\n}\n\n.chat-input {\n    display: flex;\n}\n\n.chat-input input {\n    flex: 1;\n}\n";});;
define('text!pages/game.html',[],function(){return "<template>\n    <require from=\"./game.css\"></require>\n\n    <h1>Cyberball</h1>\n\n    <phaser-game config.bind=\"gameConfig\"></phaser-game>\n\n    <div  if.bind=\"settings.chatEnabled\" class=\"chat\" css=\"width: ${gameWidth}px\">\n        <div class=\"chat-log\">\n            <div repeat.for=\"message of chatMessages\">\n                <strong>${message.sender}</strong>: <span>${message.text}</span>\n            </div>\n        </div>\n\n        <form class=\"chat-input\" submit.delegate=\"sendMessage()\">\n            <input value.bind=\"chatMessage\" />\n            <button type=\"submit\">Send</button>\n        </form>\n    </div>\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('pages/home',["require", "exports", "aurelia-templating-resources", "aurelia-framework", "models/settings-model"], function (require, exports, aurelia_templating_resources_1, aurelia_framework_1, settings_model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HomeViewModel = (function () {
        function HomeViewModel(signaler) {
            this.signaler = signaler;
            this.settings = settings_model_1.defaultSettings;
        }
        HomeViewModel.prototype.saveSettings = function () {
            console.log('settings');
            this.signaler.signal('save-settings');
        };
        HomeViewModel = __decorate([
            aurelia_framework_1.autoinject(),
            __metadata("design:paramtypes", [aurelia_templating_resources_1.BindingSignaler])
        ], HomeViewModel);
        return HomeViewModel;
    }());
    exports.HomeViewModel = HomeViewModel;
});
;
define('text!pages/home.html',[],function(){return "<template>\n    <require from=\"resources/value-converters/json-value-converter\"></require>\n    <require from=\"resources/value-converters/integer-value-converter\"></require>\n\n    <style>\n        body {\n            background: #111;\n            color: #eee;\n            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n        }\n\n        .input {\n            display: flex;\n            margin-bottom: 5px;\n        }\n\n        label {\n            width: 180px;\n        }\n\n        input[type=text], input[type=number] {\n            flex: 1;\n        }\n    </style>\n\n    <div style=\"display: flex; height: 100%;\">\n        <div style=\"margin-right: 20px;\">\n            <h1>Cyberball Configuration Builder</h1>\n\n            <h2>Player</h2>\n\n            <div class=\"input\">\n                <label for=\"player.name\">Name</label>\n                <input type=\"text\" value.bind=\"settings.player.name\" />\n            </div>\n\n            <h2>CPUs</h2>\n\n            <div repeat.for=\"cpu of settings.computerPlayers\">\n                <div class=\"input\">\n                    <label>Name</label>\n                    <input type=\"text\" value.bind=\"cpu.name\" />\n                </div>\n\n                <div class=\"input\">\n                    <label>Throw Delay</label>\n                    <input type=\"number\" value.bind=\"cpu.throwDelay | integer\" />\n                </div>\n\n                <div class=\"input\">\n                    <label>Throw Delay Variance</label>\n                    <input type=\"number\" value.bind=\"cpu.throwDelayVariance | integer\" />\n                </div>\n\n                <div class=\"input\">\n                    <label>Catch Delay</label>\n                    <input type=\"number\" value.bind=\"cpu.catchDelay | integer\" />\n                </div>\n\n                <div class=\"input\">\n                    <label>Catch Delay Variance</label>\n                    <input type=\"number\" value.bind=\"cpu.catchDelayVariance | integer\" />\n                </div>\n\n                <hr />\n            </div>\n\n            <h2>Gameplay</h2>\n\n            <div class=\"input\">\n                <label>Throw Count</label>\n                <input type=\"number\" value.bind=\"settings.throwCount | integer\" />\n            </div>\n\n            <div class=\"input\">\n                <label>Ball Speed</label>\n                <input type=\"number\" value.bind=\"settings.ballSpeed | integer\" />\n            </div>\n\n            <div class=\"input\">\n                <label>Use Schedule</label>\n                <input type=\"checkbox\" checked.bind=\"settings.useSchedule\" />\n            </div>\n\n            <div class=\"input\">\n                <label>Schedule Honors Throw Count</label>\n                <input type=\"checkbox\" checked.bind=\"settings.scheduleHonorsThrowCount\" />\n            </div>\n\n            <button click.delegate=\"saveSettings()\">Save</button>\n        </div>\n\n        <div style=\"overflow-y: auto;\">\n            <pre>${settings | json & signal: 'save-settings'}</pre>\n        </div>\n    </div>\n</template>\n";});;
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
define('resources/value-converters/integer-value-converter',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IntegerValueConverter = (function () {
        function IntegerValueConverter() {
        }
        IntegerValueConverter.prototype.fromView = function (value) {
            return parseInt(value);
        };
        return IntegerValueConverter;
    }());
    exports.IntegerValueConverter = IntegerValueConverter;
});
;
define('resources/value-converters/json-value-converter',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var JsonValueConverter = (function () {
        function JsonValueConverter() {
        }
        JsonValueConverter.prototype.toView = function (value) {
            return JSON.stringify(value, null, 2);
        };
        return JsonValueConverter;
    }());
    exports.JsonValueConverter = JsonValueConverter;
});
;
define('resources/value-converters/number-value-converter',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IntegerValueConverter = (function () {
        function IntegerValueConverter() {
        }
        IntegerValueConverter.prototype.fromView = function (value) {
            return parseInt(value);
        };
        return IntegerValueConverter;
    }());
    exports.IntegerValueConverter = IntegerValueConverter;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('scenes/cyberball',["require", "exports", "phaser"], function (require, exports, phaser_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    phaser_1 = __importDefault(phaser_1);
    var textStyle = { fontFamily: 'Arial', color: '#000000' };
    var CyberballScene = (function (_super) {
        __extends(CyberballScene, _super);
        function CyberballScene(settings) {
            var _this = _super.call(this, {}) || this;
            _this.playerHasBall = true;
            _this.ballHeld = true;
            _this.throwCount = 0;
            _this.settings = settings;
            return _this;
        }
        CyberballScene.prototype.preload = function () {
            this.load.image('ball', this.settings.baseUrl + "/" + this.settings.ballSprite);
            this.load.multiatlas('player', "./assets/player.json", 'assets');
        };
        CyberballScene.prototype.create = function () {
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
                frameRate: 12,
                frames: this.anims.generateFrameNames('player', { start: 1, end: 3, prefix: 'throw/', suffix: '.png' })
            });
            this.anims.create({
                key: 'catch',
                frames: this.anims.generateFrameNames('player', { start: 1, end: 1, prefix: 'catch/', suffix: '.png' })
            });
            var playerPosition = this.getPlayerPosition();
            this.playerGroup = this.physics.add.group({ immovable: true, allowGravity: false });
            this.playerSprite = this.playerGroup.create(playerPosition.x, playerPosition.y, 'player', 'active/1.png');
            this.add.text(playerPosition.x, playerPosition.y + this.playerSprite.height / 2 + 10, this.settings.player.name, textStyle).setOrigin(0.5);
            console.log(this.playerSprite);
            var _loop_1 = function (i) {
                var cpuPosition = this_1.getCPUPosition(i);
                var cpuSprite = this_1.playerGroup.create(cpuPosition.x, cpuPosition.y, 'player', 'idle/1.png');
                this_1.add.text(cpuPosition.x, cpuPosition.y + cpuSprite.height / 2 + 10, this_1.settings.computerPlayers[i].name, textStyle).setOrigin(0.5);
                cpuSprite.flipX = cpuPosition.x > playerPosition.x;
                cpuSprite.setData('settings', this_1.settings.computerPlayers[i]);
                cpuSprite.setInteractive();
                cpuSprite.on('pointerdown', function (e) {
                    if (_this.playerHasBall)
                        _this.throwBall(_this.playerSprite, cpuSprite);
                });
            };
            var this_1 = this;
            for (var i = 0; i < this.settings.computerPlayers.length; i++) {
                _loop_1(i);
            }
            var ballPosition = this.getActiveBallPosition(this.playerSprite);
            this.ballSprite = this.physics.add.sprite(ballPosition.x, ballPosition.y, 'ball');
            this.physics.add.overlap(this.ballSprite, this.playerGroup, function (_b, receiver) {
                if (!_this.ballHeld && receiver === _this.throwTarget)
                    _this.catchBall(receiver);
            });
        };
        CyberballScene.prototype.update = function () {
            var _this = this;
            if (this.playerHasBall) {
                this.playerSprite.play('active');
                this.playerSprite.flipX = this.input.x < this.playerSprite.x;
                var ballPosition = this.getActiveBallPosition(this.playerSprite);
                this.ballSprite.x = ballPosition.x;
                this.ballSprite.y = ballPosition.y;
            }
            else if (!this.ballHeld) {
                this.playerGroup.getChildren().forEach(function (c) {
                    var sprite = c;
                    if (sprite.frame.name.includes('idle'))
                        sprite.flipX = _this.ballSprite.x < sprite.x;
                });
            }
        };
        CyberballScene.prototype.throwBall = function (thrower, receiver) {
            this.playerHasBall = this.ballHeld = false;
            this.throwTarget = receiver;
            this.throwCount++;
            thrower.play('throw');
            thrower.anims.currentAnim.once('complete', function () { return thrower.play('idle'); });
            var ballTargetPosition = this.getCaughtBallPosition(receiver);
            this.physics.moveTo(this.ballSprite, ballTargetPosition.x, ballTargetPosition.y, 500);
        };
        CyberballScene.prototype.catchBall = function (receiver) {
            var _this = this;
            this.ballHeld = true;
            this.throwCount++;
            if (this.throwCount >= this.settings.throwCount) {
            }
            receiver.play('catch');
            var ballPosition = this.getCaughtBallPosition(receiver);
            this.ballSprite.body.reset(ballPosition.x, ballPosition.y);
            if (receiver === this.playerSprite) {
                this.playerHasBall = true;
            }
            else {
                var settings_1 = receiver.getData('settings');
                setTimeout(function () {
                    receiver.play('active');
                    ballPosition = _this.getActiveBallPosition(receiver);
                    _this.ballSprite.x = ballPosition.x;
                    _this.ballSprite.y = ballPosition.y;
                    setTimeout(function () {
                        var random = Math.random() * 100;
                        for (var i = 0; i < settings_1.targetPreference.length; i++) {
                            random -= settings_1.targetPreference[i];
                            if (random <= 0) {
                                if (i >= _this.playerGroup.getChildren().indexOf(receiver))
                                    i++;
                                _this.throwBall(receiver, _this.playerGroup.getChildren()[i]);
                                break;
                            }
                        }
                    }, _this.calculateTimeout(settings_1.throwDelay, settings_1.throwDelayVariance));
                }, this.calculateTimeout(settings_1.catchDelay, settings_1.catchDelayVariance));
            }
        };
        CyberballScene.prototype.getCPUPosition = function (i) {
            var padding = 75;
            return new phaser_1.default.Geom.Point(((this.sys.canvas.width - (padding * 2)) / (this.settings.computerPlayers.length - 1)) * i + padding, i === 0 || i === this.settings.computerPlayers.length - 1 ? this.sys.canvas.height / 2 : padding);
        };
        CyberballScene.prototype.getPlayerPosition = function () {
            var padding = 75;
            return new phaser_1.default.Geom.Point(this.sys.canvas.width / 2, this.sys.canvas.height - padding);
        };
        CyberballScene.prototype.getCaughtBallPosition = function (target) {
            return new phaser_1.default.Geom.Point(target.x + (target.flipX ? -50 : 50), target.y - 15);
        };
        CyberballScene.prototype.getActiveBallPosition = function (target) {
            return new phaser_1.default.Geom.Point(target.x + (target.flipX ? 40 : -40), target.y - 20);
        };
        CyberballScene.prototype.calculateTimeout = function (delay, variance) {
            return delay + Math.random() * variance;
        };
        return CyberballScene;
    }(phaser_1.default.Scene));
    exports.CyberballScene = CyberballScene;
});
;
define('resources',['resources/index'],function(m){return m;});
//# sourceMappingURL=app-bundle.js.map