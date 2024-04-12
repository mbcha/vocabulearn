import * as fs from 'fs';
import * as path from 'path';

const dataFolderPath = path.resolve(process.cwd(), 'src/server/api/dictionaries');
const enDictionaryFilePath = path.join(dataFolderPath, 'en.json');
const esDictionaryFilePath = path.join(dataFolderPath, 'es.json');

export type Dictionary = Record<string, string>;

function loadDictionaries(): Record<string, Dictionary>{
  try {
    const rawEnData = fs.readFileSync(enDictionaryFilePath, 'utf-8');
    const rawEsData = fs.readFileSync(esDictionaryFilePath, 'utf-8');
    const enDictionary: Dictionary = JSON.parse(rawEnData) as Dictionary;
    const esDictionary: Dictionary = JSON.parse(rawEsData) as Dictionary;
    const dictionaries = {
      en: enDictionary,
      es: esDictionary,
    };
    return dictionaries;
  } catch (error) {
    console.error('Error loading dictionary:', (error as Error).message);
    return {};
  }
}

export default loadDictionaries;
