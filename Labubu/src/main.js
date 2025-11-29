import Phaser from 'phaser';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { PauseScene } from './scenes/PauseScene.js';
import { VictoryScene } from './scenes/VictoryScene.js';

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
    scene: [MenuScene, GameScene, PauseScene, VictoryScene],
    backgroundColor: '#1a1a2e',
};

document.fonts.ready.then(() => {
    //Para la fuente
    new Phaser.Game(config);
    });