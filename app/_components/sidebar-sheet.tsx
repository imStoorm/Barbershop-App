"use client"

import Image from "next/image";
import { Button } from "./ui/button";
import { CalendarIcon, HomeIcon, LogInIcon, LogOutIcon} from "lucide-react";
import { SheetClose, SheetContent, SheetHeader, SheetTitle} from "./ui/sheet";
import { quickSearchOptions } from "../_constants/search";
import { Avatar, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { signIn, signOut, useSession } from "next-auth/react";

const SideBarSheet = () => {
    const {data} = useSession()
    const handleLoginWithGoogleClick = () => signIn('google')
    const handleSignOutClick = () => signOut()
    return (
        <SheetContent className="overflow-y-auto">
            <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex item-center py-5 border-b border-solid gap-3 justify-between" >
                {data?.user ? (
                    <div className="flex items-center gap-2">
                        <Avatar>
                               <AvatarImage src={data?.user?.image ?? ""}/>
                           </Avatar> 
                        <div>
                            <p className="font-bold">{data?.user?.name}</p>
                            <p className="text-xs">{data?.user?.email}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className="font-bold mt-2">Olá, faça o seu login!</h2>
                        <Dialog>
                        <DialogTrigger asChild>
                            <Button size={'icon'}>
                                <LogInIcon/>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[90%] rounded-xl">
                            <DialogHeader>
                                <DialogTitle>Faça login na plataforma</DialogTitle>
                                <DialogDescription>
                                    Conecte-se usando sua conta do Google
                                </DialogDescription>
                            </DialogHeader>
                            <Button variant={"outline"} className="gap-2 font-bold" onClick={handleLoginWithGoogleClick}>
                                <Image src="/google.svg" width={18} height={18} alt="Fazer login com o google"/>
                                Google
                            </Button>
                        </DialogContent>
                        </Dialog>
                    </>
                )}
            </div>
            <div className="py-5 flex flex-col gap-2 border-b border-solid">
                <SheetClose asChild>
                    <Button className="justify-start gap-2" variant={'ghost'} asChild>
                    <Link href="/">
                        <HomeIcon size={18}/>
                        Início
                    </Link>
                    </Button>
                </SheetClose>
                
                <Button className="justify-start gap-2" variant={'ghost'}>
                    <CalendarIcon size={18}/>
                    Agendamento
                    </Button>
            </div>
            <div className="py-5 flex flex-col gap-2 border-b border-solid">
                {quickSearchOptions.map(option => (
                    <Button key={option.title} className="justify-start gap-2" variant={'ghost'} asChild>
                        <Link href={`/barbershops?service=${option.title}`}>
                            <Image alt={option.title} src={option.imageUrl} width={18} height={18}/>
                            {option.title}
                        </Link>
                        
                    </Button>
                ))}
            </div>
            <div className="py-5 flex flex-col gap-2 border-b border-solid">
                <Button className="justify-start gap-2" variant={'ghost'} onClick={handleSignOutClick}>
                    <LogOutIcon/>
                    Sair da Conta
                </Button>
            </div>
        </SheetContent>
    );
}
 
export default SideBarSheet;