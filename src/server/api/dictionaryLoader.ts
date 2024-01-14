import * as fs from 'fs';
import * as path from 'path';

const dataFolderPath = path.resolve(process.cwd(), 'src/server/api/dictionaries');
const dictionaryFilePath = path.join(dataFolderPath, 'test.json');

function loadDictionary(): Record<string, string> {
  try {
    const rawData = fs.readFileSync(dictionaryFilePath, 'utf-8');
    const dictionary = JSON.parse(rawData);
    return dictionary;
  } catch (error) {
    console.error('Error loading dictionary:', (error as Error).message);
    return {};
  }
}

export default loadDictionary;
