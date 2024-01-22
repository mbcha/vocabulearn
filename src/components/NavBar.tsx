import { signIn, signOut, useSession } from "next-auth/react";
import ColorPicker from "./ColorPicker";

const NavBar = ({ setColors }: { setColors: (value: { from: string, to: string }) => void }) => {
  return (
    <nav className="w-full fixed top-0 flex justify-between items-center px-4 py-2 shadow-lg shadow-white/20 bg-i-inherit relative">
      <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-[3rem]">
        Vocabulearn
      </h1>
      <div className="flex items-center gap-2">
        <ColorPicker setColors={setColors} />
        <NavBarButton />
      </div>
    </nav>
  )
}

export default NavBar;

const NavBarButton = () => {
  const { data: sessionData } = useSession();

  return (
    <button
      className="rounded-full px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/10 border-primary border-2"
      onClick={sessionData?.user.email ? () => void signOut() : () => void signIn()}
    >
      {sessionData?.user.email ? 'Sign out' : 'Sign in'}
    </button>
  );
}
