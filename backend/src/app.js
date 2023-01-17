const express = require('express');
const http = require('http');

const core = require('./core/srv');

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    core.api.srv.start(socket);

    socket.on('ts_create_ticket', ({ type }) => {
        try {
            core.api.ts.createTicket({ type });
            core.api.srv.update(socket);
        } catch(error) {
            socket.emit('ts_create_ticket_error', error.message);
        };
    });

    socket.on('ta_call_next_ticket', () => {
        try {
            core.api.ta.callNextTicket();
            core.api.srv.update(socket);
        } catch(error) {
            socket.emit('ta_call_next_ticket_error', error.message);
        };
    });

    socket.on('ta_process_atual_ticket', () => {
        try {
            core.api.ta.processAtualTicket();
            core.api.srv.update(socket);
        } catch(error) {
            socket.emit('ta_process_atual_ticket_error', error.message);
        };
    });
});

server.listen(3000, () => {
    console.log({ server: 'Server online' });
});