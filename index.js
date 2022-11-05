const express = require('express');
const { Client, MessageMedia, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();

const client = new Client({
    authStrategy: new LocalAuth()
});
 
// const client = new Client();


client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async (msg) => {
    
    try
    {

        console.log(msg);
        let mensaje = msg.body;
        let mensajePartido = mensaje.split(' ');
        let dato = mensajePartido[mensajePartido.length-1];
        
        let isOrden = false;
        if(dato[dato.length-1]==='♦')
        {
            isOrden=true
        }
        
        if(isOrden)
        {
            let noOrden= dato.split('♦')[0];
            const media = await MessageMedia.fromUrl('http://localhost/api/V2/service/sogoo/admin/ordenes/mostrarDocumentos/Comprobante_orden_'+noOrden+'.pdf');
            msg.reply('Hemos recibido su orden correctamente, le compartimos el comprobante de orden:');
            client.sendMessage(msg.from, media);
        }
    }
    catch(err)
    {
        msg.reply(msg.fromMe, 'Lo sentimos, no encontramos ninguna orden con ese folio asignado a su cuenta de SOGOO');
        client.sendMessage('No se vaya, estamos revisando nuestro sistema para resolverlo, por favor pasenos el correo electronico y numero de telefono con el que se registro.');
    }

}); 



app.listen(8080, ()=>
{
    console.log('Ready to test');
    client.initialize();
});