import PhoneItem from "@/app/_components/phone-item";
import ServiceItem from "@/app/_components/service-item";
import SideBarSheet from "@/app/_components/sidebar-sheet";
import { Button } from "@/app/_components/ui/button";
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet";
import { db } from "@/app/_lib/prisma";
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const BarbershopPage = async ({params}: any) => {
    const barberShop = await db.barbershop.findUnique({
        where: {
            id: params.id
        },
        include: {
            services: true
        }
    })
    if(!barberShop) return notFound()

    return (
        <div>
            {/* Imagem */}
            <div className="relative w-full h-[250px]">
                <Image src={barberShop?.imageUrl} fill alt={barberShop.name} className="object-cover"/>
                <Button size={'icon'} variant={'secondary'} className="absolute left-4 top-4" asChild>
                    <Link href="/">
                    <ChevronLeftIcon/>
                    </Link>
                </Button>
                <Sheet>
                    <SheetTrigger asChild>
                    <Button size={'icon'} variant={'secondary'} className="absolute right-4 top-4">
                        <MenuIcon/>
                    </Button>
                    </SheetTrigger>
                    <SideBarSheet/>
                </Sheet>
            </div>
            {/* Informações */}
            <div className="p-5 border-b border-solid">
                <h1 className="font-bold text-xl mb-3">{barberShop?.name}</h1>
                <div className="flex items-center gap-1">
                    <MapPinIcon className="text-primary" size={18}/>
                    <p className="text-sm text-gray-300">{barberShop?.address}</p>
                </div>
                <div className="flex items-center gap-1">
                    <StarIcon className="text-primary fill-primary" size={18}/>
                    <p className="text-sm text-gray-300">5,0 (59 avaliações)</p>
                </div>
            </div>
            {/* Descrição */}
            <div className="p-5 border-b border-solid space-y-2">
                <h2 className="font-bold uppercase text-xs text-gray-400">Sobre Mim</h2>
                <p className="text-sm text-justify">{barberShop?.description}</p>
            </div>
            {/* Serviços */}
            <div className="p-5 space-y-3">
                <h2 className="font-bold uppercase text-xs text-gray-400 mb-3">Serviços </h2>
                {barberShop.services.map(service => (
                    <ServiceItem key={service.id} service={service}></ServiceItem>
                ))}
            </div>
            {/* Contato */}
            <div className="p-5 space-y-3">
                {barberShop.phones.map((phone) => (
                    <PhoneItem key={phone} phone={phone}/>
                ))}
            </div>
        </div>
        
    );
}
 
export default BarbershopPage;