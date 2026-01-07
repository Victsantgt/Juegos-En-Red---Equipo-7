import Phaser from 'phaser';
import { StartScene } from './scenes/StartScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { PauseScene } from './scenes/PauseScene.js';
import { VictoryScene } from './scenes/VictoryScene.js';
import { CreditScene } from './scenes/CreditScene.js';
import { ControlsScene } from './scenes/ControlsScene.js';
import { ConnectionLostScene } from './scenes/ConnectionLostScene.js';
import LobbyScene from './scenes/LobbyScene.js';
import { MultiplayerGameScene } from './scenes/MultiplayerGameScene.js';
import { UserScene } from './scenes/UserScene.js';
import { MultiplayerVictoryScene } from './scenes/MultiplayerVictoryScene.js';

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
    dom: {
        createContainer: true
    },
    scene: [
        StartScene, 
        MenuScene, 
        GameScene, 
        PauseScene, 
        VictoryScene, 
        CreditScene, 
        ControlsScene, 
        ConnectionLostScene, 
        UserScene, 
        LobbyScene, 
        MultiplayerGameScene,
        MultiplayerVictoryScene
    ],
    backgroundColor: '#ffffff',
};

document.fonts.ready.then(() => {
    //Para la fuente
    new Phaser.Game(config);
});