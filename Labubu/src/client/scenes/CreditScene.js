import Phaser from 'phaser';

export class CreditScene extends Phaser.Scene {

    constructor() {
        super('CreditScene');
    }

    create(data) {    
        // --- MEDIDAS ---
        const width = 704;
        const height = 576;
        const centerX = width / 2;
        const centerY = height / 2;

        // --- FONDO SEMITRANSPARENTE ---
        this.add.rectangle(0, 0, width, height, 0x000000, 0.6).setOrigin(0, 0);

        // --- TÍTULO ---
        this.add.text(centerX, centerY - 180, 'CRÉDITOS', {
            fontFamily: 'Lemon', 
            fontSize: '64px',
            color: '#8b4a00ff'
        }).setOrigin(0.5, 0.5);

        // --- LISTA DE CRÉDITOS ---
        const equipo = [
            "Carla Calvache Amador\nProgramadora UIs, community manager",
            "Daniel Redondo Pascual\nConcept art, ilustración 2D, programador",
            "Tinka Armas Martí\nConcept art, ilustración 2D, programadora",
            "Víctor Santiago Gil Torres\nCompositor, programador, guionista"
        ];

        // Ajustamos el espaciado para que quepa bien con letra más grande
        const gap = 70; 
        
        // Calculamos altura total para centrar el bloque verticalmente
        const totalHeight = (equipo.length - 1) * gap;
        // Bajamos un poco el punto de inicio (+20) para separarlo del título grande
        const startY = (centerY - (totalHeight / 2)) + 20;

        equipo.forEach((texto, index) => {
            this.add.text(centerX, startY + (index * gap), texto, {
                fontFamily: 'Lemon',
                fontSize: '18px', // Subido de 14px a 18px para mejor lectura
                color: '#ffffff', // Blanco para contrastar con el fondo oscuro
                align: 'center'
            }).setOrigin(0.5, 0.5);
        });

        // --- BOTÓN VOLVER ---
        // Estilo idéntico al botón 'Continuar' y 'Volver al Menú' de la Pausa
        const menuBtn = this.add.text(centerX, centerY + 220, 'Volver al Menú', {
            fontFamily: 'Lemon',
            fontSize: '32px',
            color: '#5eb232', 
        }).setOrigin(0.5, 0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => menuBtn.setColor('#553922')) 
        .on('pointerout', () => menuBtn.setColor('#5eb232')) 
        .on('pointerdown', () => {
            menuBtn.disableInteractive();
            this.scene.stop();
            this.scene.resume('MenuScene');
        });
    }
}