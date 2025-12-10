import Phaser from 'phaser';
import { StartScene } from './scenes/StartScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { PauseScene } from './scenes/PauseScene.js';
import { VictoryScene } from './scenes/VictoryScene.js';
import { CreditScene } from './scenes/CreditScene.js';
import { ConnectionLostScene } from './scenes/ConnectionLostScene.js';



const config = {
    type: Phaser.AUTO,
    width: 704,
    height: 576,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [StartScene, MenuScene, GameScene,PauseScene, VictoryScene, CreditScene, ConnectionLostScene],
    backgroundColor: '#ffffff',
};

document.fonts.ready.then(() => {
    //Para la fuente
    new Phaser.Game(config);
    });