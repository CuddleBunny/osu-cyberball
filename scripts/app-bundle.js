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
                { route: 'game', name: 'game', moduleId: 'pages/game' },
                { route: 'message-test', name: 'message-test', moduleId: 'pages/message-test' }
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
            this.gameOverText = "Game Over";
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
            this.gameWidth = 800;
            this.gameHeight = 460;
            this.chatMessages = [];
        }
        GameViewModel.prototype.activate = function (params) {
            if ('settings' in params) {
                this.settings = new settings_model_1.SettingsModel(JSON.parse(atob(params.settings)));
            }
            if ('playerName' in params) {
                this.settings.player.name = params.playerName;
            }
        };
        GameViewModel.prototype.bind = function () {
            this.gameConfig = {
                type: phaser_1.default.AUTO,
                width: this.gameWidth,
                height: this.gameHeight,
                scene: new cyberball_1.CyberballScene(this.settings),
                physics: {
                    default: 'arcade'
                }
            };
        };
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
define('text!pages/game.css',[],function(){return "canvas {\n    max-width: 100%;\n}\n\n.chat-log {\n    border: 1px solid black;\n    border-bottom: 0;\n    height: 100px;\n    overflow-y: auto;\n}\n\n.chat-input {\n    display: flex;\n}\n\n.chat-input input {\n    flex: 1;\n}\n";});;
define('text!pages/game.html',[],function(){return "<template>\n    <require from=\"./game.css\"></require>\n\n    <phaser-game config.bind=\"gameConfig\"></phaser-game>\n\n    <div if.bind=\"settings.chatEnabled\" class=\"chat\" css=\"width: ${gameWidth}px\">\n        <div class=\"chat-log\">\n            <div repeat.for=\"message of chatMessages\">\n                <strong>${message.sender}</strong>: <span>${message.text}</span>\n            </div>\n        </div>\n\n        <form class=\"chat-input\" submit.delegate=\"sendMessage()\">\n            <input value.bind=\"chatMessage\" />\n            <button type=\"submit\">Send</button>\n        </form>\n    </div>\n</template>\n";});;
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
define('pages/home',["require", "exports", "aurelia-templating-resources", "aurelia-framework", "models/settings-model", "models/cpu-model", "clipboard"], function (require, exports, aurelia_templating_resources_1, aurelia_framework_1, settings_model_1, cpu_model_1, clipboard_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    clipboard_1 = __importDefault(clipboard_1);
    var HomeViewModel = (function () {
        function HomeViewModel(signaler) {
            this.signaler = signaler;
            this.settings = settings_model_1.defaultSettings;
        }
        HomeViewModel.prototype.bind = function () {
            this.clipboard = new clipboard_1.default('#copy');
        };
        HomeViewModel.prototype.unbind = function () {
            this.clipboard.destroy();
        };
        HomeViewModel.prototype.addCPU = function () {
            var _this = this;
            this.settings.computerPlayers.push(new cpu_model_1.CPUModel({
                name: "Player " + (this.settings.computerPlayers.length + 2)
            }));
            this.settings.computerPlayers.forEach(function (cpu) {
                while (cpu.targetPreference.length != _this.settings.computerPlayers.length)
                    cpu.targetPreference.push(0);
            });
        };
        HomeViewModel.prototype.removeCPU = function () {
            this.settings.computerPlayers.pop();
            this.settings.computerPlayers.forEach(function (cpu) {
                cpu.targetPreference.pop();
            });
        };
        HomeViewModel.prototype.saveSettings = function () {
            this.signaler.signal('save-settings');
        };
        Object.defineProperty(HomeViewModel.prototype, "url", {
            get: function () {
                var url = document.location.origin + document.location.pathname;
                url += '#game?settings=';
                url += btoa(JSON.stringify(this.settings));
                return url;
            },
            enumerable: true,
            configurable: true
        });
        HomeViewModel.prototype.testGame = function () {
            window.open(this.url);
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
define('text!pages/home.html',[],function(){return "<template>\n    <require from=\"resources/value-converters/json-value-converter\"></require>\n    <require from=\"resources/value-converters/integer-value-converter\"></require>\n    <require from=\"resources/value-converters/integer-array-value-converter\"></require>\n\n    <style>\n        body {\n            background: #111;\n            color: #eee;\n            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n        }\n\n        .input {\n            display: flex;\n            margin-bottom: 5px;\n        }\n\n        .input label {\n            width: 180px;\n        }\n\n        .input label + * {\n            box-sizing: border-box;\n            max-width: 300px;\n        }\n\n        .input input[type=text], .input input[type=number], textarea {\n            flex: 1 1 100%;\n            min-width: 0;\n            width: auto;\n        }\n\n        .input > div {\n            display: flex;\n        }\n\n        pre {\n            max-width: 100%;\n            overflow-x: auto;\n        }\n    </style>\n\n    <div style=\"display: flex;\">\n        <div style=\"margin-right: 20px;\">\n            <h1>Cyberball Configuration Builder</h1>\n\n            <h2>Player</h2>\n\n            <div class=\"input\">\n                <label for=\"player.name\">Name</label>\n                <input type=\"text\" value.bind=\"settings.player.name\" />\n            </div>\n\n            <div class=\"input\">\n                <label for=\"player.tint\">Tint Color</label>\n                <input type=\"color\" value.bind=\"settings.player.tint\" />\n            </div>\n\n            <h2>\n                CPUs\n                <button click.delegate=\"addCPU()\">+ Add CPU</button>\n                <button click.delegate=\"removeCPU()\">- Remove CPU</button>\n            </h2>\n\n            <div repeat.for=\"cpu of settings.computerPlayers\">\n                <div class=\"input\">\n                    <label>Name</label>\n                    <input type=\"text\" value.bind=\"cpu.name\" />\n                </div>\n\n                <div class=\"input\">\n                    <label>Tint Color</label>\n                    <input type=\"color\" value.bind=\"cpu.tint\" />\n                </div>\n\n                <div class=\"input\">\n                    <label>Throw Delay</label>\n                    <input type=\"number\" value.bind=\"cpu.throwDelay | integer\" />\n                </div>\n\n                <div class=\"input\">\n                    <label>Throw Delay Variance</label>\n                    <input type=\"number\" value.bind=\"cpu.throwDelayVariance | integer\" />\n                </div>\n\n                <div class=\"input\">\n                    <label>Catch Delay</label>\n                    <input type=\"number\" value.bind=\"cpu.catchDelay | integer\" />\n                </div>\n\n                <div class=\"input\">\n                    <label>Catch Delay Variance</label>\n                    <input type=\"number\" value.bind=\"cpu.catchDelayVariance | integer\" />\n                </div>\n\n\n                <div class=\"input\">\n                    <label>Target Preference</label>\n\n                    <div>\n                        <input repeat.for=\"target of cpu.targetPreference\" type=\"number\" value.bind=\"cpu.targetPreference[$index] | integer\" />\n                    </div>\n                </div>\n\n                <hr />\n            </div>\n\n            <h2>Gameplay</h2>\n\n            <div class=\"input\">\n                <label>Throw Count</label>\n                <input type=\"number\" value.bind=\"settings.throwCount | integer\" />\n            </div>\n\n            <div class=\"input\">\n                <label>Ball Speed</label>\n                <input type=\"number\" value.bind=\"settings.ballSpeed | integer\" />\n            </div>\n\n            <div class=\"input\">\n                <label for=\"ball.tint\">Ball Tint Color</label>\n                <input type=\"color\" value.bind=\"settings.ballTint\" />\n            </div>\n\n            <div class=\"input\">\n                <label>Use Schedule</label>\n                <input type=\"checkbox\" checked.bind=\"settings.useSchedule\" />\n            </div>\n\n            <div class=\"input\" if.bind=\"settings.useSchedule\">\n                <label>Schedule</label>\n                <textarea value.bind=\"settings.schedule | integerArray & updateTrigger:'blur'\"></textarea>\n            </div>\n\n            <div class=\"input\">\n                <label>Schedule Honors Throw Count</label>\n                <input type=\"checkbox\" checked.bind=\"settings.scheduleHonorsThrowCount\" />\n            </div>\n\n            <div class=\"input\">\n                <label>Game Over Text</label>\n                <input type=\"text\" value.bind=\"settings.gameOverText\" />\n            </div>\n\n            <button click.delegate=\"saveSettings()\">Save</button>\n        </div>\n\n        <div style=\"overflow-y: auto;\">\n            <pre>${settings | json & signal: 'save-settings'}</pre>\n        </div>\n    </div>\n\n    <div>\n        <h1>\n            Code\n            <button id=\"copy\" data-clipboard-target=\"#code\">&#10697; Copy</button>\n            <button click.delegate=\"testGame()\">&#129514; Test</button>\n        </h1>\n        <pre id=\"code\">&lt;iframe id=\"cyberball\" width=\"100%\" height=\"580\" src=\"${url}\"&gt;&lt;/iframe&gt;</pre>\n    </div>\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('pages/message-test',["require", "exports", "aurelia-templating-resources", "aurelia-framework"], function (require, exports, aurelia_templating_resources_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MessageTestViewModel = (function () {
        function MessageTestViewModel(signaler) {
            this.signaler = signaler;
            this.messages = [];
        }
        MessageTestViewModel.prototype.bind = function () {
            var _this = this;
            window.addEventListener('message', function (e) {
                console.log('message', e.data);
                _this.messages.push(e.data);
                _this.signaler.signal('message');
            });
        };
        MessageTestViewModel = __decorate([
            aurelia_framework_1.autoinject(),
            __metadata("design:paramtypes", [aurelia_templating_resources_1.BindingSignaler])
        ], MessageTestViewModel);
        return MessageTestViewModel;
    }());
    exports.MessageTestViewModel = MessageTestViewModel;
});
;
define('text!pages/message-test.html',[],function(){return "<template>\n    <require from=\"resources/value-converters/json-value-converter\"></require>\n\n    <iframe src=\"/#game\" width=\"800\" height=\"600\"></iframe>\n    <div style=\"border: 1px solid black; width: 800px; height: 200px; overflow-y: auto;\">\n        <div repeat.for=\"message of messages\">${message | json & signal: 'message'}</div>\n    </div>\n</template>\n";});;
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
define('resources/value-converters/integer-array-value-converter',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IntegerArrayValueConverter = (function () {
        function IntegerArrayValueConverter() {
        }
        IntegerArrayValueConverter.prototype.fromView = function (value) {
            value = value.replace(/[^0-9,]/g, '');
            if (value[value.length - 1] == ',')
                value = value.substr(0, value.length - 1);
            return JSON.parse("[" + value + "]");
        };
        IntegerArrayValueConverter.prototype.toView = function (value) {
            return JSON.stringify(value).substr(1, value.length * 2 - 1);
        };
        return IntegerArrayValueConverter;
    }());
    exports.IntegerArrayValueConverter = IntegerArrayValueConverter;
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
            _this.scheduleIndex = 0;
            _this.lastTime = Date.now();
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
            this.playerSprite.setData('settings', this.settings.player);
            if (this.settings.player.tint)
                this.playerSprite.setTint(parseInt(this.settings.player.tint.substr(1), 16));
            this.add.text(playerPosition.x, playerPosition.y + this.playerSprite.height / 2 + 10, this.settings.player.name, textStyle).setOrigin(0.5);
            var _loop_1 = function (i) {
                var cpuPosition = this_1.getCPUPosition(i);
                var cpuSprite = this_1.playerGroup.create(cpuPosition.x, cpuPosition.y, 'player', 'idle/1.png');
                this_1.add.text(cpuPosition.x, cpuPosition.y + cpuSprite.height / 2 + 10, this_1.settings.computerPlayers[i].name, textStyle).setOrigin(0.5);
                cpuSprite.flipX = cpuPosition.x > playerPosition.x;
                cpuSprite.setData('settings', this_1.settings.computerPlayers[i]);
                if (this_1.settings.computerPlayers[i].tint)
                    cpuSprite.setTint(parseInt(this_1.settings.computerPlayers[i].tint.substr(1), 16));
                cpuSprite.setInteractive();
                cpuSprite.on('pointerdown', function (e) {
                    if (_this.playerHasBall) {
                        _this.playerSprite.flipX = _this.input.x < _this.playerSprite.x;
                        var ballPosition_1 = _this.getActiveBallPosition(_this.playerSprite);
                        _this.ballSprite.x = ballPosition_1.x;
                        _this.ballSprite.y = ballPosition_1.y;
                        _this.throwBall(_this.playerSprite, cpuSprite);
                    }
                });
            };
            var this_1 = this;
            for (var i = 0; i < this.settings.computerPlayers.length; i++) {
                _loop_1(i);
            }
            var ballPosition = this.getActiveBallPosition(this.playerSprite);
            this.ballSprite = this.physics.add.sprite(ballPosition.x, ballPosition.y, 'ball');
            if (this.settings.ballTint)
                this.ballSprite.setTint(parseInt(this.settings.ballTint.substr(1), 16));
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
        CyberballScene.prototype.gameOver = function () {
            window.parent.postMessage({ type: 'game-end' }, '*');
            clearTimeout(this.activeTimeout);
            this.playerGroup.children.each(function (child) { return child.removeAllListeners(); });
            this.add.rectangle(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.sys.canvas.width, this.sys.canvas.height, 0xdddddd, 0.5);
            this.add.text(this.sys.canvas.width / 2, this.sys.canvas.height / 2, this.settings.gameOverText, textStyle).setOrigin(0.5);
        };
        CyberballScene.prototype.throwBall = function (thrower, receiver) {
            window.parent.postMessage({
                type: 'throw',
                thrower: thrower.getData('settings').name,
                receiver: receiver.getData('settings').name,
                wait: Date.now() - this.lastTime
            }, '*');
            this.lastTime = Date.now();
            this.playerHasBall = this.ballHeld = false;
            this.throwTarget = receiver;
            this.throwCount++;
            thrower.play('throw');
            thrower.anims.currentAnim.once('complete', function () { return thrower.play('idle'); });
            var ballTargetPosition = this.getCaughtBallPosition(receiver);
            this.physics.moveTo(this.ballSprite, ballTargetPosition.x, ballTargetPosition.y, this.settings.ballSpeed);
        };
        CyberballScene.prototype.catchBall = function (receiver) {
            var _this = this;
            this.ballHeld = true;
            receiver.play('catch');
            var ballPosition = this.getCaughtBallPosition(receiver);
            this.ballSprite.body.reset(ballPosition.x, ballPosition.y);
            if ((this.settings.useSchedule && this.scheduleIndex === this.settings.schedule.length) ||
                (this.settings.useSchedule && this.settings.scheduleHonorsThrowCount && this.throwCount >= this.settings.throwCount) ||
                (!this.settings.useSchedule && this.throwCount >= this.settings.throwCount)) {
                this.gameOver();
                return;
            }
            if (receiver === this.playerSprite) {
                this.playerHasBall = true;
            }
            else {
                var settings_1 = receiver.getData('settings');
                this.activeTimeout = setTimeout(function () {
                    receiver.play('active');
                    ballPosition = _this.getActiveBallPosition(receiver);
                    _this.ballSprite.x = ballPosition.x;
                    _this.ballSprite.y = ballPosition.y;
                    _this.activeTimeout = setTimeout(function () {
                        if (_this.settings.useSchedule) {
                            while (_this.settings.schedule[_this.scheduleIndex] === _this.playerGroup.getChildren().indexOf(receiver))
                                _this.scheduleIndex++;
                            _this.throwBall(receiver, _this.playerGroup.getChildren()[_this.settings.schedule[_this.scheduleIndex]]);
                            _this.scheduleIndex++;
                        }
                        else {
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
                        }
                    }, _this.calculateTimeout(settings_1.throwDelay, settings_1.throwDelayVariance));
                }, this.calculateTimeout(settings_1.catchDelay, settings_1.catchDelayVariance));
            }
        };
        CyberballScene.prototype.getCPUPosition = function (i) {
            var padding = 75;
            if (this.settings.computerPlayers.length === 1) {
                return new phaser_1.default.Geom.Point(this.sys.canvas.width / 2, padding);
            }
            return new phaser_1.default.Geom.Point(((this.sys.canvas.width - (padding * 2)) / (this.settings.computerPlayers.length - 1)) * i + padding, i === 0 || i === this.settings.computerPlayers.length - 1
                ? this.sys.canvas.height / 2
                : padding);
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