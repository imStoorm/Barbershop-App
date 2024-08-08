import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card"

const BookingItem = () => {
    return (
        <>
            <h2 className="mt-6 mb-3 uppercase text-gray-400 font-bold text-xs">Agendamentos</h2>
            <Card>
            <CardContent className="flex justify-between p-0">
                <div className="flex flex-col gap-2 py-5 pl-5">
                <Badge className="w-fit">Confirmado</Badge>
                <h3 className="font-semibold">Corte de Cabelo</h3>
                <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage alt="Corte de Cabelo" src="https://thispersondoesnotexist.com/"></AvatarImage>  
                    </Avatar>
                    <p>Barbearia FSW</p>
                </div>
                </div>
                <div className="flex flex-col items-center justify-center px-5 border-l-2 border-solid">
                <p className="text-sm">Agosto</p>
                <p className="text-2xl font-semibold">08</p>
                <p className="text-sm">09:45</p>
                </div>
            </CardContent>
            </Card>
        </>
    );
}
 
export default BookingItem;