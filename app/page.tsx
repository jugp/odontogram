import Image from "next/image";
import Odontogram from "./odontogram";

const Home: React.FC = () => {
  return (
    <Odontogram imagePath={"/odontograma.jpg"}/>
  );
}

export default Home;
