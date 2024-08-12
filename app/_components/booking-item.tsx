import { Prisma } from "@prisma/client";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card"
import { format, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import PhoneItem from "./phone-item";
import { Button } from "./ui/button";
import Image from "next/image";
import BookingSumary from "./booking-summary";

interface BookingItemProps {
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
const BookingItem = ({ booking }: BookingItemProps) => {
    const isConfirmed = isFuture(booking.date)
    return (
        <>
            <Sheet>
                <SheetTrigger className="min-w-full">
                    <Card>
                        <CardContent className="flex justify-between p-0">
                            <div className="flex flex-col gap-2 py-5 pl-5">
                                <Badge className="w-fit" variant={isConfirmed ? 'default' : 'secondary'}>{isConfirmed ? "Confirmado" : "Finalizado"}</Badge>
                                <h3 className="font-semibold">{booking.service.name}</h3>
                                <div className="flex items-center">
                                    <Avatar className="h-6 w-6 mr-2">
                                        <AvatarImage alt="Corte de Cabelo" src={booking.service.barbershop.imageUrl}></AvatarImage>
                                    </Avatar>
                                    <p>{booking.service.barbershop.name}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center px-5 border-l-2 border-solid">
                                <p className="text-sm capitalize">{format(booking.date, 'MMMM', { locale: ptBR })}</p>
                                <p className="text-2xl font-semibold">{format(booking.date, 'dd', { locale: ptBR })}</p>
                                <p className="text-sm">{format(booking.date, 'HH:mm', { locale: ptBR })}</p>
                            </div>
                        </CardContent>
                    </Card>
                </SheetTrigger>
                <SheetContent className="w-[90%]">
                    <SheetHeader>
                        <SheetTitle className="text-left">Informações da Reserva</SheetTitle>
                    </SheetHeader>

                    <div className="relative h-[180px] w-full flex items-end mt-6">
                        <Image className="object-cover rounded-xl" src="/map.png" fill alt="Mapa" />
                        <Card className="z-50 w-full mb-3 mx-5 rounded-xl">
                            <CardContent className="px-5 py-3 items-center gap-3 flex">
                                <Avatar>
                                    <AvatarImage src={booking.service.barbershop.imageUrl} />
                                </Avatar>
                                <div>
                                    <h3 className="font-bold">{booking.service.barbershop.name}</h3>
                                    <p className="text-xs">{booking.service.barbershop.address}</p>
                                </div>

                            </CardContent>
                        </Card>
                    </div>
                    <div className="mt-6">
                        <Badge className="w-fit" variant={isConfirmed ? 'default' : 'secondary'}>{isConfirmed ? "Confirmado" : "Finalizado"}</Badge>
                        <div className="mt-3 mb-6">
                            <BookingSumary booking={booking}/>
                        </div>
                        
                        <div className="space-y-3 gap-2 mt-5">
                            {booking.service.barbershop.phones.map((phone, index) => (
                                <PhoneItem key={index} phone={phone} />
                            ))}
                        </div>
                    </div>

                    <SheetFooter className="mt-10 flex flex-row justify-between items-center gap-2">
                        <Button className="w-[50%]" variant={'secondary'}>
                            Voltar
                        </Button>
                        <Button className="w-[50%] bg-red-500">
                            Cancelar Reserva
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet >
        </>
    );
}

export default BookingItem;