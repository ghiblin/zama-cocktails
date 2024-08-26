import { Auth } from "@/components/auth/auth";
import { Cocktails } from "@/components/cocktail/cocktail";

export default function Home() {
  return (
    <>
      <h1 className="text-4xl font-mono text-center mb-4 text-slate-700">
        Zama Cocktails
      </h1>
      <p className="text-lg italic text-center">
        A small demo project to test CLI authentication
      </p>
      <Auth className="mb-4" />
      <Cocktails />
    </>
  );
}
