import Header from "../_components/header";
import { db } from "../_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import { notFound } from "next/navigation";
import BookingItem from "../_components/booking-item";

const Bookings = async () => {
    const session = await getServerSession(authOptions)
    if(!session) return notFound()
    const bookings = await db.booking.findMany({
        where: {
            userId: (session?.user as any).id
        },
        include: {
            service: {
                include:  {
                    barbershop: true
                }
            }
        },
        orderBy: {
            date: 'asc'
        }
    })

    const confirmedBookings = bookings.filter(booking => booking.date > new Date())
    const pastBookings = bookings.filter(booking => booking.date < new Date())
    
    return (
        <>
        <Header/>
        <div className="p-5 space-y-3">
            <h1 className="font-bold text-xl">Agendamentos</h1>
            {confirmedBookings  && (
                <>
                    <h2 className="mt-6 mb-3 uppercase text-gray-400 font-bold text-xs">Confirmados</h2>
                    {confirmedBookings.map(booking => (
                        <BookingItem key={booking.id} booking={booking}/>
                    ))}
                </>
            )}
            {pastBookings && (
                <>
                    <h2 className="mt-6 mb-3 uppercase text-gray-400 font-bold text-xs">Finalizados</h2>
                    {pastBookings.map(booking => (
                        <BookingItem key={booking.id} booking={booking}/>
                    ))}
                </>
            )}
        </div>
        </>
    );
}
 
export default Bookings;