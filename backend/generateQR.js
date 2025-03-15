const QRCode = require('qrcode');
const fs = require('fs');

async function generateQRCode() {
    try {
        const message = 'Welcome to the Event! Enjoy your time.'; // Message to be encoded
        const qrCodePath = './event_qr.png'; // Path to save the QR code image

        await QRCode.toFile(qrCodePath, message, {
            color: {
                dark: '#000000',  // QR Code color
                light: '#ffffff'  // Background color
            }
        });

        console.log('✅ QR Code Generated Successfully: ', qrCodePath);
    } catch (error) {
        console.error('❌ QR Code generation failed:', error);
    }
}

generateQRCode();
