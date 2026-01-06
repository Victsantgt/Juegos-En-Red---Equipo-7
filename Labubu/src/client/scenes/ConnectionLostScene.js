import Phaser from 'phaser';
import { connectionManager } from '../services/ConnectionManager';

/**
 * Escena que se muestra cuando se pierde la conexión con el servidor
 * Pausa el resto de escenas y comprueba continuamente hasta que se restablezca
 */
export class ConnectionLostScene extends Phaser.Scene {

    constructor() {
        super('ConnectionLostScene');
        this.reconnectCheckInterval = null;
    }

    init(data) {
        // Guardar la escena que estaba activa cuando se perdió la conexión
        this.previousScene = data.previousScene;
    }

    create() {
        // --- ESTILOS Y MEDIDAS ---
        const { width, height } = this.scale;
        const centerX = width / 2;
        const centerY = height / 2;

        const colors = {
            green: 0x5eb232,      
            darkBrown: 0x553922,  
            red: '#8a452e',       
            yellow: '#e6dd38',    
            white: '#ffffff',
            shadow: 0x000000
        };

        // 1. FONDO 
        this.add.rectangle(0, 0, width, height, colors.shadow, 0.7).setOrigin(0);

        // 2. PANEL CENTRAL (Ventana de alerta)
        const panelWidth = 600;
        const panelHeight = 300;

        // Sombra del panel
        this.add.graphics()
            .fillStyle(0x000000, 0.5)
            .fillRoundedRect(centerX - panelWidth/2 + 10, centerY - panelHeight/2 + 10, panelWidth, panelHeight, 20);

        // Fondo y Borde del panel
        const panel = this.add.graphics();
        panel.fillStyle(colors.darkBrown, 1); 
        panel.fillRoundedRect(centerX - panelWidth/2, centerY - panelHeight/2, panelWidth, panelHeight, 20);
        panel.lineStyle(4, colors.green, 1); 
        panel.strokeRoundedRect(centerX - panelWidth/2, centerY - panelHeight/2, panelWidth, panelHeight, 20);

        // 3. TEXTOS (Con estilo Lemon)

        // Título: CONEXIÓN PERDIDA
        this.add.text(centerX, centerY - 60, 'CONEXIÓN PERDIDA', {
            fontFamily: 'Lemon',
            fontSize: '42px',
            color: colors.red,
            stroke: '#ffffff',
            strokeThickness: 3,
            shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 0, stroke: true, fill: true }
        }).setOrigin(0.5);

        // Mensaje de estado (Amarillo)
        this.statusText = this.add.text(centerX, centerY + 20, 'Intentando reconectar...', {
            fontFamily: 'Lemon',
            fontSize: '20px',
            color: colors.yellow
        }).setOrigin(0.5);

        // Contador de intentos (Blanco/Gris)
        this.attemptCount = 0;
        this.attemptText = this.add.text(centerX, centerY + 70, 'Intentos: 0', {
            fontFamily: 'Lemon',
            fontSize: '16px',
            color: '#aaaaaa'
        }).setOrigin(0.5);

        // --- LÓGICA ---

        // Indicador parpadeante
        this.dotCount = 0;
        this.time.addEvent({
            delay: 500, 
            callback: () => {
                this.dotCount = (this.dotCount + 1) % 4;
                const dots = '.'.repeat(this.dotCount);
                // Solo actualizamos si no hemos conectado aún
                if (this.statusText.text.includes('Intentando')) {
                     this.statusText.setText(`Intentando reconectar${dots}`);
                }
            },
            loop: true
        });

        // Listener para cambios de conexión
        this.connectionListener = (data) => {
            if (data.connected) {
                this.onReconnected();
            }
        };
        connectionManager.addListener(this.connectionListener);

        // Intentar reconectar cada 2 segundos
        this.reconnectCheckInterval = setInterval(() => {
            this.attemptReconnect();
        }, 2000);

        // Primer intento inmediato
        this.attemptReconnect();
    }

    async attemptReconnect() {
        this.attemptCount++;
        this.attemptText.setText(`Intentos: ${this.attemptCount}`);
        await connectionManager.checkConnection();
    }
    
    onReconnected() {
        // Limpiar interval
        if (this.reconnectCheckInterval) {
            clearInterval(this.reconnectCheckInterval);
        }

        // Remover listener
        connectionManager.removeListener(this.connectionListener);

        // Mensaje de éxito (Actualizamos al Verde del estilo)
        this.statusText.setText('¡Conexión restablecida!');
        this.statusText.setColor('#5eb232'); // Verde brillante
        this.statusText.setStroke('#ffffff', 2); // Un pequeño borde para resaltar

        // Volver a la escena anterior
        this.time.delayedCall(1000, () => {
            this.scene.stop();
            if (this.previousScene) {
                this.scene.resume(this.previousScene);
            }
        });
    }

    shutdown() {
        // Limpiar el interval al cerrar la escena
        if (this.reconnectCheckInterval) {
            clearInterval(this.reconnectCheckInterval);
        }
        // Remover el listener
        if (this.connectionListener) {
            connectionManager.removeListener(this.connectionListener);
        }
    }
}