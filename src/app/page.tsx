import HowToUse from "@/components/landing-page/HowToUse";
import Image from "next/image";


const Home = async ()=>{
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full laptop:p-24 tablet:p-12 p-4 h-[500px] py-10 flex items-center flex-row justify-between gap-4">
        <div className="flex items-start flex-col tablet:w-1/2 w-full gap-3">
          <h1 className="tablet:text-4xl text-2xl font-montserrat">From Lost to Found: A Seamless Solution for Lost Items</h1>
          <p className="font-poppins tablet:text-base text-sm">Your beacon of hope in the sea of lost belongings. Seamlessly connecting lost items with their rightful owners.</p>
        </div>
        <div className="tablet:flex items-center flex-col tablet:w-1/2 w-full gap-3 justify-center hidden">
         <Image src="/assets/images/image.png" alt="hero img" height={400} width={400} className="rounded-3xl"/>
        </div>
      </div>

      <div className="w-full laptop:p-24 tablet:p-12 p-4 flex flex-col" >
        <h3 className="text-3xl font-montserrat">How to use LostLink?</h3>
        <HowToUse/>
      </div>
    </main>
  );
}


export default Home;