import { useSession } from "next-auth/react";
import Head from "next/head";
import NavBar from "@/components/NavBar";
import WordCard from "@/components/WordCard";

import { api } from "@/utils/api";
import type { Word } from "@prisma/client";
import { useState, useEffect } from "react";

interface WordProps {
  id?: number;
  name: string;
  definition: string;
  notes?: string | null;
}

const Home = () => {
  const [currentColor, setCurrentColor] = useState<{ from?: string, to?: string }>({ from: '--color-primary: #06b6d4;', to: '--color-secondary: #3b82f6;' });

  const onColorChange = (value: { from?: string, to?: string }) => {
    setCurrentColor({
      from: value.from ? `--color-primary: ${value.from};` : currentColor.from,
      to: value.to ? `--color-secondary: ${value.to};` : currentColor.to
    })
  }

  return (
    <>
      <Head>
        <title>Vocabulearn</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
        <style>:root {`{${currentColor.from} ${currentColor.to}}`}</style>
      </Head>
      <Body setColors={onColorChange} />
    </>
  );
}

const Body = ({ setColors }: { setColors: (color: { from?: string, to?: string }) => void }) => {
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
    <main className={`flex min-h-screen relative max-h-full flex-col items-center justify-center bg-gradient`}>
      <NavBar setColors={setColors} />
      <WordCards randomWord={randomWord} generateRandomWord={() => setShouldGenerateWord(true)} />
    </main>
  )
}

const WordCards = ({ randomWord, generateRandomWord }: { randomWord: WordProps, generateRandomWord: () => void }) => {
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

export default Home;
