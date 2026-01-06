import Phaser from 'phaser';
import { connectionManager } from '../services/ConnectionManager';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        this.load.image('menuFondo', 'assets/menuFondo.png');
        this.load.audio('musicaFondo', 'assets/audio/menuPpal.mp3');
    }

    create() {

        // --- CONFIGURACIÓN INICIAL ---
        this.cameras.main.setBackgroundColor('#ffffff');
        this.cameras.main.fadeIn(1000, 255, 255, 255);

        this.add.image(0, 0, 'menuFondo').setOrigin(0, 0);

        this.events.removeAllListeners('resume');

        //estado anterior para comparar con el nuevo
        this.prevConnected = null;
        this.prevCount = null;

        // --- CAPA DE OSCURECIMIENTO (OVERLAY) ---
        const overlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000)
            .setOrigin(0, 0)
            .setAlpha(0)
            .setDepth(10);

        // --- BOTÓN LOCAL ---
        const localBtn = this.add.text(610, 163, 'Modo Local', {
            fontFamily: 'Lemon',
            fontSize: '24px',
            color: '#5eb232',
        }).setOrigin(0.7, 0.7)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => localBtn.setColor('#553922'))
            .on('pointerout', () => localBtn.setColor('#5eb232'))
            .on('pointerdown', () => {
                localBtn.disableInteractive();
                this.cameras.main.fadeOut(1000, 255, 255, 255);
                this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                    this.scene.start('GameScene');
                });
            });


        // --- BOTÓN ONLINE (ACTIVO) ---
        const onlineBtn = this.add.text(600, 255, 'Modo Online', {
            fontFamily: 'Lemon',
            fontSize: '24px',
            color: '#5eb232',
        }).setOrigin(0.6, 0.6)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => onlineBtn.setColor('#553922'))
            .on('pointerout', () => onlineBtn.setColor('#5eb232'))
            .on('pointerdown', () => {
                this.scene.start('LobbyScene');
            });

        /*
        // --- BOTÓN CONTROLES ---
        // Descomentar esto y comentar el de arriba cuando se suba a alguna plataforma
        
        const controlsBtn = this.add.text(600, 255, 'Controles', {
            fontFamily: 'Lemon',
            fontSize: '24px',
            color: '#5eb232',
        }).setOrigin(0.6, 0.6)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => controlsBtn.setColor('#553922'))
        .on('pointerout', () => controlsBtn.setColor('#5eb232'))
        .on('pointerdown', () => {
            controlsBtn.disableInteractive();

            this.tweens.add({
                targets: overlay, 
                alpha: 0.6,
                duration: 500,
                onComplete: () => {
                    this.scene.pause();
                    this.scene.launch('ControlsScene');
                }
            });
        });
        */

        // --- BOTÓN USUARIO ---
        const userBtn = this.add.text(124, 487, 'Editar Usuario', {
            fontFamily: 'Lemon',
            fontSize: '20px',
            color: '#5eb232',
        }).setOrigin(0.7, 0.7)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => userBtn.setColor('#553922'))
            .on('pointerout', () => userBtn.setColor('#5eb232'))
            .on('pointerdown', () => {
                userBtn.disableInteractive();
                this.tweens.add({
                    targets: overlay,
                    alpha: 0.6,
                    duration: 500,
                    onComplete: () => {
                        this.scene.pause();
                        this.scene.launch('UserScene');
                    }
                });
            });

        // --- BOTÓN CRÉDITOS ---
        const creditBtn = this.add.text(110, 545, 'Créditos', {
            fontFamily: 'Lemon',
            fontSize: '24px',
            color: '#5eb232',
        }).setOrigin(0.7, 0.7)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => creditBtn.setColor('#553922'))
            .on('pointerout', () => creditBtn.setColor('#5eb232'))
            .on('pointerdown', () => {
                creditBtn.disableInteractive();
                this.tweens.add({
                    targets: overlay,
                    alpha: 0.6,
                    duration: 500,
                    onComplete: () => {
                        this.scene.pause();
                        this.scene.launch('CreditScene');
                    }
                });
            });

        // --- EVENTO RESUME ---
        this.events.on('resume', () => {
            this.tweens.add({
                targets: overlay,
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    creditBtn.setInteractive();
                    creditBtn.setColor('#5eb232');

                    userBtn.setInteractive();
                    userBtn.setColor('#5eb232');

                    // --- BOTÓN CONTROLES ---
                    // Descomentar esto cuando se active el botón de controles
                    /*
                    if (controlsBtn) {
                        controlsBtn.setInteractive();
                        controlsBtn.setColor('#5eb232');
                    }
                    */
                }
            });
        });

        // --- GESTIÓN DE AUDIO ---
        let musicaAnterior = this.sound.get('musicaBatalla');
        if (musicaAnterior) {
            musicaAnterior.stop();
            musicaAnterior.destroy();
            this.musica = this.sound.add('musicaFondo', { loop: true, volume: 0.5 });
            this.musica.play();
        }

        musicaAnterior = this.sound.get('musicaVictoria');
        if (musicaAnterior) {
            musicaAnterior.stop();
            musicaAnterior.destroy();
            this.musica = this.sound.add('musicaFondo', { loop: true, volume: 0.5 });
            this.musica.play();
        }

        // --- GESTIÓN DE CONEXIÓN ---
        this.connectionText = this.add.text(127, 20, 'Comprobando servidor...', {
            fontSize: '14px',
            fontFamily: 'Lemon',
            color: '#ffa200ff'
        }).setOrigin(0.5);

        this.connectionListener = (data) => {
            this.updateConnectionDisplay(data);
        };
        connectionManager.addListener(this.connectionListener);

        const status = connectionManager.getStatus();

        const datosParaMostrar = {
            connected: status.isConnected,
            count: status.connectedCount
        };

        this.updateConnectionDisplay(datosParaMostrar);
    }

    updateConnectionDisplay(data) {


        // Quite la comprobación de ".isActive", porque a veces falla 
        // justo en el milisegundo en que se crea la escena.

        // Si el texto no existe (la escena se cerró), no hacemos nada.
        if (!this.connectionText) {
            return;
        }

        //DETECCIÓN DE CONEXIÓN/DESCONEXIÓN

        // Alguien se conecta
        if (data.count > this.prevCount) {
            console.log('Jugador se ha conectado');
        }

        // Alguien se desconecta
        if (data.count < this.prevCount) {
            console.log('Jugador se ha desconectado');
        }


        // Servidor se desconecta
        if (this.prevConnected && !data.connected) {
            console.log('Servidor desconectado');
        }

        // Servidor se conecta
        if (!this.prevConnected && data.connected) {
            console.log('Servidor conectado');
        }

        console.log(data.count);

        console.log('Actualizando conexión:', data);
        try {
            if (data.connected) {
                this.connectionText.setText(`${data.count} usuario(s) conectado(s)`);
                this.connectionText.setColor('#5eb232'); // Verde
            } else {
                this.connectionText.setText('Servidor desconectado');
                this.connectionText.setColor('#ff0000'); // Rojo
            }
        } catch (error) {
            console.error('[MenuScene] Error updating connection display:', error);
        }
    }

    shutdown() {
        if (this.connectionListener) {
            connectionManager.removeListener(this.connectionListener);
        }
    }
}