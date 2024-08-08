import Header from "./_components/header";
import { Button } from "./_components/ui/button";
import Image from "next/image";
import { db } from "./_lib/prisma";
import BarbershopItem from "./_components/barbershop-item";
import { quickSearchOptions } from "./_constants/search";
import BookingItem from "./_components/booking-item";
import Search from "./_components/search";
import Link from "next/link";


const Home = async () => {
  const barbershops = await db.barbershop.findMany({})
  const popularBarbershops = await db.barbershop.findMany({
    orderBy: {
      name: 'desc'
    }
  })
  return (
      <div>
        {/* Header */}
        <Header/>
        <div className="p-5">
          <h2 className="text-xl font-bold">Olá, Usuário.</h2>
          <p>Quarta-Feira, 07 de agosto.</p>
        {/* Barra de Pesquisa*/}
          <div className="mt-6">
            <Search/>
          </div>
        {/* Busca Rápida */}
          <div className="flex gap-3 mt-6 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
            {quickSearchOptions.map(option => (
              <Button key={option.title} className="gap-2" variant={"secondary"} asChild>
                <Link href={`/barbershops?service=${option.title}`}>
                  <Image src={option.imageUrl} width={16} height={16} alt={option.title}/>
                  {option.title}
                </Link>
              </Button>
            ))}
          </div>
          {/* Banner */}
          <div className="relative w-full h-[150px] mt-6">
            <Image alt="Agende com os melhores" src="/banner-01.png" fill className="object-cover rounded-xl"/>
          </div>
          {/* Booking Item */}
          <BookingItem/>
          {/* Recomendados */}
          <h2 className="mt-6 mb-3 uppercase text-gray-400 font-bold text-xs">Recomendados</h2>
          <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
            {
              barbershops.map(barbershop => (
                <BarbershopItem key={barbershop.id} barbershop={barbershop}/>
              ))
            }
          </div>
          {/* Populares */}
          <h2 className="mt-6 mb-3 uppercase text-gray-400 font-bold text-xs">Populares</h2>
          <div className="flex gap-4 overflow-auto [&::-webkit-scrollbar]:hidden">
            {
              popularBarbershops.map(barbershop => (
                <BarbershopItem key={barbershop.id} barbershop={barbershop}/>
              ))
            }
          </div>
        </div>
      </div>
  );
}
 
export default Home;

