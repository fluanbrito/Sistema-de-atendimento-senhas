const SRV = {
    state: {
        tickets: {
            open: [],
            closed: [],
            count: {
                N: 0,
                P: 0
            },
            atual: [],
            last_generated: {},
        }
    },

    api: {
        srv: {
            start(socket) {
                socket.emit('srv_tickets_data', SRV.api.tv.getTicketsData());
            },

            update(socket) {
                socket.emit('srv_tickets_data', SRV.api.tv.getTicketsData());
                socket.broadcast.emit('srv_tickets_data', SRV.api.tv.getTicketsData());
            }
        },

        ts: {
            createTicket({ type }) {
                const VALID_TICKET_TYPES = ['N', 'P'];
                if (!VALID_TICKET_TYPES.includes(type)) throw new Error('Tipo de senha inválida (N ou P)');

                SRV.state.tickets.count[type] += 1;

                SRV.state.tickets.open.push({
                    id: `${type}${SRV.state.tickets.count[type]}`,
                    type
                });

                SRV.api.ts.sortOpenTickets();
                SRV.state.tickets.last_generated = {
                    id: `${type}${SRV.state.tickets.count[type]}`,
                    type
                }
            },

            sortOpenTickets() {
                SRV.state.tickets.open.sort((firstTicket, secondTicket) => {
                    return firstTicket.id < secondTicket.id && firstTicket.id.length < secondTicket.id.length ? -1 : 1;
                });

                let tickets = { N: [], P: [] };

                SRV.state.tickets.open.map(ticket => {
                    tickets[ticket.type].push(ticket);
                });

                SRV.state.tickets.open = [];

                let exists_pending_tickets_to_sequence = true;

                function incrementArraySequence() {
                    if (tickets['N'].length) {
                        SRV.state.tickets.open.push(tickets['N'][0]);
                        tickets['N'].shift();
                    };

                    if (tickets['N'].length) {
                        SRV.state.tickets.open.push(tickets['N'][0]);
                        tickets['N'].shift();
                    };

                    if (tickets['P'].length) {
                        SRV.state.tickets.open.push(tickets['P'][0]);
                        tickets['P'].shift();
                    };

                    exists_pending_tickets_to_sequence = tickets['N'].length || tickets['P'].length;
                };

                while(exists_pending_tickets_to_sequence) {
                    incrementArraySequence();
                };
            }
        },

        ta: {
            processAtualTicket() {
                if (!SRV.state.tickets.atual.length) throw new Error('Não existe nenhum ticket para ser atendido');

                SRV.state.tickets.closed.push(SRV.state.tickets.atual[0]);
                SRV.state.tickets.atual = [];
            },

            callNextTicket() {
                if (SRV.state.tickets.atual.length) throw new Error('Já existe um ticket sendo atendido');
                if (!SRV.state.tickets.open.length) throw new Error('Não há nenhum ticket para ser chamado');

                SRV.state.tickets.atual.push(SRV.state.tickets.open[0]);
                SRV.state.tickets.open.shift();
            }
        },

        tv: {
            getTicketsData() {
                console.log({
                    open: SRV.state.tickets.open,
                    closed: SRV.state.tickets.closed,
                    atual: SRV.state.tickets.atual,
                    last: SRV.state.tickets.last_generated,
                });

                return {
                    open: SRV.state.tickets.open,
                    closed: SRV.state.tickets.closed,
                    atual: SRV.state.tickets.atual,
                    last: SRV.state.tickets.last_generated,
                };
            }
        }
    }
};

module.exports = SRV;
