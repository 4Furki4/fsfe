const express = require('express');
const http = require('http');
const server = http.createServer()
const app = express();

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname })
})

server.on('request', app)

server.listen(3000, () => {
    console.log('Server is running on port 3000')
})

// Begin WebSocket

const WebSockerServer = require('ws').Server;

const wss = new WebSockerServer({ server });

wss.on('connection', function connection(ws) {
    const numClient = wss.clients
    console.log('Clients connected', numClient.size)
    wss.broadcast(`current clients connected: ${numClient.size}`)
    if (ws.readyState === ws.OPEN) {
        ws.send('Welcome to the chat room')
    }
    ws.on('close', () => {
        console.log('Client disconnected')
        wss.broadcast(`current clients connected: ${numClient.size}`)
    })
})


wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        if (client.readyState === client.OPEN) {
            client.send(data)
        }
    })
}