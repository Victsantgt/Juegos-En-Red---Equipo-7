import Phaser from 'phaser';
import { StartScene } from './scenes/StartScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { PauseScene } from './scenes/PauseScene.js';

const config = {
    type: Phaser.AUTO,
    width: 704,
    height: 576,
    backgroundColor: '#ffffff',
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [StartScene, MenuScene, GameScene, PauseScene],
};

document.fonts.ready.then(() => {
    //Para la fuente
    new Phaser.Game(config);
    });