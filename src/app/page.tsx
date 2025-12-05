import Image from "next/image";
import logo from "../../public/images/ai logo.avif";

export default function Home() {
  return <Image src={logo} alt="AI Logo" />;
}
