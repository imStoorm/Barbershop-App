import { Prisma } from "@prisma/client";
import { Card, CardContent } from "./ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BookingSumaryProps {
    booking: Prisma.BookingGetPayload<{
        include: {
            service: {
                include: {
                    barbershop: true
                }
            }
        }
    }>
}
const BookingSumary = ({booking}: BookingSumaryProps) => {
    return (
        <Card>
            <CardContent className="space-y-3 p-3">
                <div className="flex items-center justify-between">
                    <h2 className="font-bold">{booking.service.name}</h2>
                    <p className="text-sm font-bold">
                        {Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        }).format(Number(booking.service.price))}
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <h2 className="text-sm text-gray-400">Data</h2>
                    <p className="text-sm">{format(booking.date, "d 'de' MMMM", {locale: ptBR})}</p>
                </div>

                <div className="flex items-center justify-between">
                    <h2 className="text-sm text-gray-400">Horário</h2>
                    <p className="text-sm">{format(booking.date, 'HH:mm', { locale: ptBR })}</p>
                </div>

                <div className="flex items-center justify-between">
                    <h2 className="text-sm text-gray-400">Barbearia</h2>
                    <p className="text-sm">{booking.service.barbershop.name}</p>
                </div>
            </CardContent>
        </Card>
    );
}

export default BookingSumary;