"use client"

import { Barbershop, BarbershopService, Booking } from "@prisma/client"
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "./ui/sheet";
import { Calendar } from "./ui/calendar";

import { ptBR } from "date-fns/locale"
import { useEffect, useMemo, useState } from "react";
import { format, isPast, isToday, set } from "date-fns";
import { createBooking } from "../_actions/create-booking";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getBookings } from "../_actions/get-bookings";
import { Dialog, DialogContent } from "./ui/dialog";
import SignInDialog from "./sign-in-dialog";
interface ServiceItemProps {
    service: BarbershopService
    barbershop: Pick<Barbershop, "name">
}

const TIME_LIST = [
    "00:00",
    "01:00",
    "02:00",
    "03:00"
]
interface GetTimeListProps {
    bookings:  Booking[]
    selectedDay: Date
}
const getTimeList = ({bookings, selectedDay}: GetTimeListProps) => {
    return TIME_LIST.filter(time => {
        const hour = Number(time.split(':')[0])
        const minutes = Number(time.split(':')[1])

        const timeIsOnThePast = isPast(set(new Date(), {hours: hour, minutes}))
        if(timeIsOnThePast && isToday(selectedDay)) return false
        const hasBookingOnCurrentTime = bookings?.some(booking => booking.date.getHours() === hour && booking.date.getMinutes() === minutes)
        if(hasBookingOnCurrentTime) {
            return false
        }
        return true
    })
}
const ServiceItem = ({service, barbershop}: ServiceItemProps) => {
    const {data} = useSession()
    const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
    const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)

    const [dayBookings, setDayBookings] = useState<Booking[]>([])
    const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false)
    const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false)

    useEffect(() => {
        const fetch = async () => {
            if(!selectedDay) return;
            const bookings = await getBookings({date: selectedDay, serviceId: service.id})
            setDayBookings(bookings)
        }
        fetch()
    }, [selectedDay, service.id])

    const handleBookingClick = () => {
        if(data?.user) {
            return setBookingSheetIsOpen(true)
        } else {
            return setSignInDialogIsOpen(true)
        }
    }
    const handleBookingSheetOpenChange = () => {
        setSelectedDay(undefined)
        setSelectedTime(undefined)
        setDayBookings([])
        setBookingSheetIsOpen(false)
    }

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDay(date)
    }
    const handleTimeSelect = (time: string) => {
        setSelectedTime(time)
    }

    const handleCreateBooking = async () => {
        //1. Não exibir horários já agendados
        //2. Não deixar o usuário reservar sem estar logado

        if(!selectedDay || !selectedTime) return;
        const hour = selectedTime?.split(":")[0]
        const minutes = selectedTime?.split(":")[1]

        const newDate = set(selectedDay, {
            hours: Number(hour),
            minutes: Number(minutes),
        })
        try {
            await createBooking({
                serviceId: service.id,
                userId: (data?.user as any).id,
                date: newDate
            })
            toast.error("Reserva criada com sucesso!")
        } catch(err) {
            console.log(err)
            toast.error("Erro ao criar reserva!")
        }
    }
    const timeList = useMemo(() => {
        if(!selectedDay) return []
        return getTimeList({bookings: dayBookings, selectedDay})
    }, [dayBookings, selectedDay])

    return (
        <>
            <Card>
                <CardContent className="flex item-center gap-3 p-3">
                    {/* Imagem */}
                    <div className="relative min-h-[110px] min-w-[110px] max-h-[110px] max-w-[110px]">
                        <Image alt={service.name} src={service.imageUrl} fill className="rounded-lg contain-cover"/>
                    </div>
                    {/* Direita */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-sm">{service.name}</h3>
                        <p className="text-gray-400 text-sm">{service.description}</p>
                        {/* Preço e Botão */}
                        <div className="flex items-center justify-between">
                            <p className="font-bold text-sm text-primary">{Intl.NumberFormat('pt-br', {
                                style: 'currency',
                                currency: 'BRL'
                            }).format(Number(service.price))}</p>
                            <Sheet open={bookingSheetIsOpen} onOpenChange={handleBookingSheetOpenChange}>
                                <Button variant={'secondary'} size="sm" onClick={handleBookingClick}>
                                Reservar
                                </Button>
                                <SheetContent className="px-0">
                                    <SheetHeader>
                                        <SheetTitle>Fazer reserva</SheetTitle>
                                    </SheetHeader>
                                    <div className="py-5 border-b border-solid">
                                        <Calendar mode="single" fromDate={new Date()} locale={ptBR} selected={selectedDay} onSelect={(date) => handleDateSelect(date)} styles={{head_cell: {width: "100%",textTransform: "capitalize",},cell: {width: "100%",},button: {width: "100%",},nav_button_previous: {width: "32px",height: "32px",}, nav_button_next: {width: "32px",height: "32px",},caption: {textTransform: "capitalize",},}}>

                                        </Calendar>
                                    </div>
                                    {selectedDay && (
                                        <div className="flex px-5 overflow-x-auto p-5 gap-4 [&::-webkit-scrollbar]:hidden border-b border-solid">
                                            {timeList[0] ? timeList.map(horario => (
                                                <Button key={horario} variant={selectedTime === horario ? "default" : "outline"} className="rounded-full" onClick={() => handleTimeSelect(horario)}>{horario}</Button>
                                            )) : <p>Nenhum horário disponível</p>}
                                        </div>
                                    )}
                                    {selectedTime && selectedDay && (
                                        <div className="p-5">
                                            <Card>
                                            <CardContent className="space-y-3 p-3">
                                                <div className="flex items-center justify-between">
                                                    <h2 className="font-bold">{service.name}</h2>
                                                    <p className="text-sm font-bold">
                                                    {Intl.NumberFormat("pt-BR", {
                                                        style: "currency",
                                                        currency: "BRL",
                                                    }).format(Number(service.price))}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <h2 className="text-sm text-gray-400">Data</h2>
                                                    <p className="text-sm">
                                                    {format(selectedDay, "d 'de' MMMM", {
                                                        locale: ptBR,
                                                    })}
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <h2 className="text-sm text-gray-400">Horário</h2>
                                                    <p className="text-sm">{selectedTime}</p>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <h2 className="text-sm text-gray-400">Barbearia</h2>
                                                    <p className="text-sm">{barbershop.name}</p>
                                                </div>
                                            </CardContent>
                                            </Card>
                                        </div>
                                    )}

                                    <SheetFooter className="px-5 mt-5">
                                        <SheetClose asChild>
                                            <Button type="submit" onClick={handleCreateBooking} disabled={!selectedDay || !selectedTime}>Confirmar</Button>
                                        </SheetClose>
                                    </SheetFooter>
                                    
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Dialog open={signInDialogIsOpen} onOpenChange={(open) => setSignInDialogIsOpen(open)}>
                <DialogContent className="w-[90%] rounded-xl">
                    <SignInDialog/>
                </DialogContent>
            </Dialog>
        </>
    )
}
 
export default ServiceItem;