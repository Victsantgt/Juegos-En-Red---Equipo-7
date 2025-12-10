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

        // --- CAPA DE OSCURECIMIENTO (OVERLAY) ---
        // Creamos un rectángulo negro que ocupa toda la pantalla, pero invisible (alpha 0)
        const overlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000)
            .setOrigin(0, 0)
            .setAlpha(0)
            .setDepth(10); // Depth alto para que tape los botones

        // --- BOTÓN LOCAL ---
        const localBtn = this.add.text(625, 163, 'Local 2 Jugadores', {
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

        // --- BOTÓN ONLINE ---
        this.add.text(600, 255, 'Online (no disponible)', {
            fontFamily: 'Lemon',
            fontSize: '20px',
            color: '#b23232ff',
        }).setOrigin(0.6, 0.6);
        
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

            // TWEEN: Animamos el oscurecimiento suavemente
            this.tweens.add({
                targets: overlay,
                alpha: 0.6, // Se oscurece al 60% (se sigue viendo el fondo)
                duration: 500, // Duración del fundido (0.5 segundos)
                onComplete: () => {
                    // Una vez oscuro, pausamos y lanzamos
                    this.scene.pause();
                    this.scene.launch('CreditScene');
                }
            });
        });

        // --- EVENTO RESUME (Al volver de créditos) ---
        this.events.on('resume', () => {
            // Quitamos el oscurecimiento suavemente
            this.tweens.add({
                targets: overlay,
                alpha: 0, // Vuelve a ser invisible
                duration: 300,
                onComplete: () => {
                    // Reactivamos el botón al terminar la animación
                    creditBtn.setInteractive();
                    creditBtn.setColor('#5eb232'); 
                }
            });
        });

        let musicaAnterior = this.sound.get('musicaBatalla');
        if (musicaAnterior) {
            musicaAnterior.stop();
            musicaAnterior.destroy();
            this.musica = this.sound.add('musicaFondo', {
                loop: true,
                volume: 0.5
            });
            this.musica.play();
        }

        musicaAnterior = this.sound.get('musicaVictoria');
        if (musicaAnterior) {
            musicaAnterior.stop();
            musicaAnterior.destroy();
            this.musica = this.sound.add('musicaFondo', {
                loop: true,
                volume: 0.5
            });
            this.musica.play();
        }

        //////ESTO ES NUEVO//////////////
        // Indicador de conexión al servidor
        this.connectionText = this.add.text(400, 500, 'Servidor: Comprobando...', {
            fontSize: '18px',
            color: '#ffff00'
        }).setOrigin(0.5);

        // Listener para cambios de conexión ESTO ES DE CLASE NUEVO
        this.connectionListener = (data) => {
            this.updateConnectionDisplay(data);
        };
        connectionManager.addListener(this.connectionListener);
    }

    // ESTO ES NUEVO DE CLASE ////////////////////////////////////////////////////////////
    updateConnectionDisplay(data) {
        // Solo actualizar si el texto existe (la escena está creada)
        if (!this.connectionText || !this.scene || !this.scene.isActive('MenuScene')) {
            return;
        }

        try {
            if (data.connected) {
                this.connectionText.setText(`Servidor: ${data.count} usuario(s) conectado(s)`);
                this.connectionText.setColor('#000dffff');
            } else {
                this.connectionText.setText('Servidor: Desconectado');
                this.connectionText.setColor('#ff0000');
            }
        } catch (error) {
            console.error('[MenuScene] Error updating connection display:', error);
        }
    }

    shutdown() {
        // Remover el listener
        if (this.connectionListener) {
            connectionManager.removeListener(this.connectionListener);
        }
    }
}