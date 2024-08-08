import { BarbershopService } from "@prisma/client";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface ServiceItemProps {
    service: BarbershopService
}
const ServiceItem = ({service}: ServiceItemProps) => {
    return (
        <Card>
            <CardContent className="flex item-center gap-3 p-3">
                {/* Imagem */}
                <div className="relative min-h-[110px] min-w-[110px] max-h-[110px] max-w-[110px]">
                    <Image alt={service.name} src={service.imageUrl} fill className=" rounded-lgcontain-cover"/>
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
                        <Button variant={'secondary'} size="sm">
                            Reservar
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
 
export default ServiceItem;