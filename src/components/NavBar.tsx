import { signIn, signOut, useSession } from "next-auth/react";
import ColorPicker from "./ColorPicker";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from "react";

const NavBar = ({ setColors, setCurrentLanguage, currentLanguage }: {
  setColors: (value: { from?: string, to?: string }) => void,
  setCurrentLanguage: (value: string) => void,
  currentLanguage: string
}) => {
  const { data: sessionData } = useSession();

  return (
    <nav className="w-full fixed top-0 flex justify-between items-center px-4 py-2 shadow-lg shadow-white/20 bg-i-inherit">
      <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-[3rem]">
        Vocabulearn
      </h1>
      <div className="flex items-center gap-2">
        { sessionData?.user?.email ? (
          <UserMenu
            setColors={setColors}
            setCurrentLanguage={setCurrentLanguage}
            currentLanguage={currentLanguage}
          />
        ) : (
          <>
            <ColorPicker setColors={setColors} />
            <NavBarButton />
          </>
        )}
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

const UserMenu = ({ setColors, setCurrentLanguage, currentLanguage }: { setColors: (value: { from?: string, to?: string }) => void, setCurrentLanguage: (value: string) => void, currentLanguage: string }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div>
      <FontAwesomeIcon icon={['far', 'user']} className="cursor-pointer w-6 h-6 m-2 text-white" onClick={() => setShowUserMenu(!showUserMenu)} />
      { showUserMenu && (
        <div className="absolute bg-white rounded-lg shadow right-2 top-14 p-2 w-30">
          <p>Play</p>
          <p>All my words</p>
          { currentLanguage === "en" ? (
            <p className="cursor-pointer" onClick={() => setCurrentLanguage("es")}>Spanish</p>
          ) : (
            <p className="cursor-pointer" onClick={() => setCurrentLanguage("en")}>English</p>
          )}
          <ColorPicker setColors={setColors} />
        </div>
      )}
    </div>
  )
}
