import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from "react";
import { api } from "@/utils/api";

interface WordProps {
  id?: number;
  name: string;
  definition: string;
  notes?: string | null;
}

type WordCardProps = {
  value: WordProps,
  onAfterAction: (action: string) => void
  currentLanguage: string;
}

const WordCard = ({ value: { id, name, definition, notes }, currentLanguage, onAfterAction }: WordCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputDefinition, setInputDefinition] = useState<string>(definition);
  const [inputNotes, setInputNotes] = useState<string>(notes ?? '');

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

        void createWord({ name, definition, language: currentLanguage });
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

  return (
    <div className={`rounded-xl shadow-lg flex w-full justify-between ${id ? 'bg-white/60' : 'bg-white/80'}`}>
      <div className="p-8 w-full">
        <p className="text-2xl font-bold text-gray-800 mb-3">{ name.charAt(0).toUpperCase() + name.slice(1) }</p>
        { isEditing && (
          <div className="w-full flex flex-col justify-start">
            <textarea className="w-full text-lg text-gray-500 mb-2 rounded p-2 bg-white/50 focus-visible:outline-none" value={inputDefinition} onChange={(e) => setInputDefinition(e.target.value)} />
            <input type="text" className="w-full text-lg text-gray-500 italic mb-2 rounded p-2 bg-white/50 focus-visible:outline-none" value={inputNotes} onChange={(e) => setInputNotes(e.target.value)} placeholder="Add note" />
            <div className="self-end rounded-full p-0.5 bg-gradient">
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
              <p className="text-lg text-gray-600 mb-2 inline">
                { definition }
                { definition.length > 200 && (
                  <FontAwesomeIcon
                    icon="caret-up"
                    className="cursor-pointer text-sm text-secondary inline ml-2 h-6 mb-[-4px]"
                    onClick={() => setIsExpanded(false)}
                  />
                )}
              </p>
            ) : (
              <p className="text-lg text-gray-600 mb-2">
                { definition.slice(0, 200) }
                { definition.length > 200 && (
                  <p className="inline text-lg" onClick={() => setIsExpanded(true)}>
                    ... <FontAwesomeIcon icon="caret-down" className="cursor-pointer text-sm text-secondary inline ml-2 h-6" />
                  </p>
                )}
              </p>
            )}
            { notes && <p className="text-lg text-gray-600 italic">{ notes }</p> }
          </>
        )}
      </div>
      <Actions id={id} handleOnClick={handleOnClick} />
    </div>
  )
}

export default WordCard;

const Actions = ({ id, handleOnClick }: {id?: number, handleOnClick: (action: string) => void }) => {
  const { data: sessionData } = useSession();

  return (
    <>
      { id ? (
        <div className="border-l-2 justify-between border-secondary flex flex-col text-gray-800">
          <div className="flex flex-col">
            <FontAwesomeIcon icon="check-double" className="cursor-pointer w-6 h-6 m-2 mb-4" />
            <FontAwesomeIcon icon="pen-to-square" className="cursor-pointer w-6 h-6 m-2 mb-4" onClick={() => handleOnClick('edit')} />
          </div>
          <FontAwesomeIcon icon={['far', 'trash-can']} className="cursor-pointer w-6 h-6 m-2" onClick={() => handleOnClick('delete')} />
        </div>
      ) : (
        <div className="border-l-2 border-secondary flex flex-col text-gray-800">
          { sessionData?.user?.email && <FontAwesomeIcon icon="heart" className="cursor-pointer w-6 h-6 m-2 mb-4" onClick={() => handleOnClick('create')} /> }
          <FontAwesomeIcon icon="rotate" className="cursor-pointer w-6 h-6 m-2 mb-4" onClick={() => handleOnClick('refresh')} />
        </div>
      )}
    </>
  )
}
