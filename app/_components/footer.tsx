import { Card, CardContent } from "./ui/card";

const Footer = () => {
    return (
        <Card className="mt-5">
            <CardContent className=" py-6 px-5 flex justify-center">
                <p className=" text-gray-400 font-semibold, text-sm">© 2024 Copyright <span className="font-bold">Storm</span></p>
            </CardContent>
        </Card>
    );
}
 
export default Footer;