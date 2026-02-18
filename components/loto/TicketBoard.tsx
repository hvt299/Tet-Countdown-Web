'use client';

import LotoTicket from './LotoTicket';

interface TicketBoardProps {
    myTickets: number[][][];
    drawnNumbers: number[];
    gameState: 'BUYING' | 'DRAWING' | 'CLOSED';
    onKinh: (ticketIndex: number) => void;
}

export default function TicketBoard({ myTickets, drawnNumbers, gameState, onKinh }: TicketBoardProps) {
    if (myTickets.length === 0) return null;

    return (
        <div className="w-full flex flex-col gap-4">
            {myTickets.map((matrix, idx) => (
                <LotoTicket
                    key={idx}
                    matrix={matrix}
                    drawnNumbers={drawnNumbers}
                    ticketIndex={idx}
                    onKinh={onKinh}
                    gameState={gameState}
                />
            ))}
        </div>
    );
}