import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";

import { api } from "@/utils/api";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckDouble, faTrashCan, faHeart, faRotate, faPenToSquare, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import type { Word } from "@prisma/client";
import { useState, useEffect } from "react";

interface WordProps {
  id?: number;
  name: string;
  definition: string;
  notes?: string | null;
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Vocabulearn</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Body />
    </>
  );
}

function Body() {
  const [shouldGenerateWord, setShouldGenerateWord] = useState(true);

  const { data: randomWord = { name: '', definition: '' }, refetch: generateRandomWord } = api.word.getRandomWord.useQuery(undefined, {
    enabled: false
  });

  useEffect(() => {
    if (shouldGenerateWord) {
      void generateRandomWord()
      setShouldGenerateWord(false)
    }
  }, [shouldGenerateWord, generateRandomWord]);

  return (
    <main className="flex min-h-screen relative max-h-full flex-col items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500">
      <NavBar />
      <UserGreeting randomWord={randomWord} generateRandomWord={() => setShouldGenerateWord(true)} />
    </main>
  )
}

function NavBar() {
  const { data: sessionData } = useSession();

  return (
    <nav className="w-full fixed top-0 flex justify-between items-center px-4 py-2 shadow-lg shadow-white/20 bg-gradient-to-r from-cyan-500 to-blue-500">
      <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-[3rem]">
        Vocabulearn
      </h1>
      <div className="flex flex-col items-center gap-2">
        { sessionData?.user.email ? <SignOutButton /> : <SignInButton /> }
      </div>
    </nav>
  )
}

function UserGreeting({ randomWord, generateRandomWord }: { randomWord: WordProps, generateRandomWord: () => void}) {
  const { data: sessionData } = useSession();
  const { data: userWords, refetch: refetchUserWords } = api.word.getUserWords.useQuery(undefined, {
    enabled: !!sessionData?.user?.email
  });

  const onAfterAction = (action: string) => {
    switch (action) {
      case 'create':
        void refetchUserWords()
      case 'create':
      case 'refresh':
        void generateRandomWord()
        break;
      case 'delete':
      case 'update':
        void refetchUserWords()
        break;
    }
  }

  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-2 mt-28 mb-16">
      { randomWord.definition &&
        <WordCard
          value={randomWord}
          onAfterAction={onAfterAction}
        />
      }
      { sessionData?.user?.email && !!userWords?.length && (
        <div className="w-full flex flex-col items-center gap-2">
          { userWords.map((userWord: Word) => (
            <WordCard
              key={userWord.id}
              value={{ id: userWord.id, name: userWord.name, definition: userWord.definition, notes: userWord.notes }}
              onAfterAction={onAfterAction}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function SignInButton() {
  return (
    <button
      className="rounded-full px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/10 border-cyan-500 border-2"
      onClick={() => void signIn()}
    >
      Sign in
    </button>
  );
}

function SignOutButton() {
  return (
    <button
      className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
      onClick={() => void signOut()}
    >
      Sign out
    </button>
  );
}

function WordCard({ value: { id, name, definition, notes }, onAfterAction }: { value: WordProps, onAfterAction: (action: string) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputDefinition, setInputDefinition] = useState<string>(definition);
  const [inputNotes, setInputNotes] = useState<string>(notes ?? '');
  const { data: sessionData } = useSession();

  const handleOnSuccess = (action: string) => ({
    onSuccess: () => {
      onAfterAction(action)
    }
  })

  const { mutate: createWord, isLoading: isCreatingWord } = api.word.create.useMutation(handleOnSuccess('create'));
  const { mutate: updateWord, isLoading: isUpdatingWord } = api.word.update.useMutation(handleOnSuccess('update'));
  const { mutate: deleteWord, isLoading: isDeletingWord } = api.word.delete.useMutation(handleOnSuccess('delete'));

  const handleOnClick = (action: string) => {
    switch (action) {
      case 'create':
        if (isCreatingWord) return;

        sessionData?.user?.email ? void createWord({ name, definition }) : void signIn();
        break;
      case 'edit':
        setIsEditing(!isEditing);
        break;
      case 'update':
        if (isUpdatingWord) return;

        setIsEditing(false);
        void updateWord({ id: id!, notes: inputNotes, definition: inputDefinition })
        break;
      case 'delete':
        if (isDeletingWord) return;

        void deleteWord({ id: id! })
        break;
      case 'refresh':
        void onAfterAction('refresh')
        setIsExpanded(false)
        break;
    }
  }

  const Actions = () => {
    if (id) {
      return (
        <>
          <FontAwesomeIcon icon={faCheckDouble} className="p-4 cursor-pointer text-gray-800 text-2xl pb-5" />
          <FontAwesomeIcon icon={faPenToSquare} className="p-4 cursor-pointer text-gray-800 text-2xl pb-5" onClick={() => handleOnClick('edit')} />
          <FontAwesomeIcon icon={faTrashCan} className="p-4 cursor-pointer text-gray-800 text-2xl" onClick={() => handleOnClick('delete')} />
        </>
      )
    } else {
      return (
        <>
          { sessionData?.user?.email && <FontAwesomeIcon icon={faHeart} className="p-4 cursor-pointer text-gray-800 text-2xl pb-5" onClick={() => handleOnClick('create')} /> }
          <FontAwesomeIcon icon={faRotate} className="p-4 cursor-pointer text-gray-800 text-2xl" onClick={() => handleOnClick('refresh')} />
        </>
      )
    }
  }

  return (
    <div className={`rounded-xl shadow-lg flex w-full justify-between ${id ? 'bg-white/60' : 'bg-white/80'}`}>
      <div className="p-8 w-full">
        <p className="text-2xl font-bold text-gray-800 mb-3">{ name.charAt(0).toUpperCase() + name.slice(1) }</p>
        { isEditing && (
          <div className="w-full flex flex-col justify-start">
            <textarea className="w-full text-lg text-gray-500 mb-2 rounded p-2 bg-white/50 focus-visible:outline-none" value={inputDefinition} onChange={(e) => setInputDefinition(e.target.value)} />
            <input type="text" className="w-full text-lg text-gray-500 italic mb-2 rounded p-2 bg-white/50 focus-visible:outline-none" value={inputNotes} onChange={(e) => setInputNotes(e.target.value)} placeholder="Add note" />
            <div className="self-end rounded-full p-0.5 bg-gradient-to-l from-cyan-500 to-blue-500">
              <button
                className="rounded-full bg-white/60 px-10 py-3 font-semibold no-underline transition hover:bg-white/70 self-end"
                onClick={() => handleOnClick('update')}
              >
                Save
              </button>
            </div>
          </div>
        )}
        { !isEditing && (
          <>
            { isExpanded ? (
              <p className="text-lg text-gray-600 mb-2">
                { definition }
                { definition.length > 200 && (
                  <FontAwesomeIcon
                    icon={faCaretUp}
                    className="cursor-pointer text-lg text-blue-500 inline ml-2"
                    onClick={() => setIsExpanded(false)}
                  />
                )}
              </p>
            ) : (
              <p className="text-lg text-gray-600 mb-2">
                { definition.slice(0, 200) }
                { definition.length > 200 && (
                  <p className="inline text-lg" onClick={() => setIsExpanded(true)}>
                    ... <FontAwesomeIcon icon={faCaretDown} className="cursor-pointer text-lg text-blue-500 ml-2" />
                  </p>
                )}
              </p>
            )}
            { notes && <p className="text-lg text-gray-600 italic">{ notes }</p> }
          </>
        )}
      </div>
      <div className="border-l-2 border-blue-500 flex flex-col">
        <Actions />
      </div>
    </div>
  )
}
