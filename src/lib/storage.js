import { isLegacyStarterDocument, starterDocument } from "../data/defaultDocument";

const DB_NAME = "rizam-md-workspace";
const DB_VERSION = 1;
const STORE_NAME = "documents";
const LOCAL_DOCUMENTS_KEY = "rizam-md-documents-backup";

export const ACTIVE_DOCUMENT_KEY = "rizam-md-active-document";

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("updatedAt", "updatedAt", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function runStore(mode, action) {
  return openDatabase().then(
    (database) =>
      new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, mode);
        const store = transaction.objectStore(STORE_NAME);
        const request = action(store);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        transaction.oncomplete = () => database.close();
        transaction.onerror = () => {
          database.close();
          reject(transaction.error);
        };
      }),
  );
}

export function createDocument(fields = {}) {
  const now = new Date().toISOString();

  return {
    id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    title: fields.title || starterDocument.title,
    content: fields.content || starterDocument.content,
    createdAt: fields.createdAt || now,
    updatedAt: fields.updatedAt || now,
  };
}

function readLocalDocuments() {
  try {
    const value = localStorage.getItem(LOCAL_DOCUMENTS_KEY);
    if (!value) return [];

    const documents = JSON.parse(value);
    return Array.isArray(documents) ? documents : [];
  } catch {
    return [];
  }
}

function writeLocalDocuments(documents) {
  try {
    localStorage.setItem(LOCAL_DOCUMENTS_KEY, JSON.stringify(sortDocuments(documents)));
  } catch {
    
  }
}

async function saveDocumentToIndexedDb(document) {
  return runStore("readwrite", (store) => store.put(document));
}

export async function getDocuments() {
  const localDocuments = readLocalDocuments();

  try {
    let documents = await runStore("readonly", (store) => store.getAll());

    if (documents.length > 0) {
      documents = await migrateLegacyStarterDocuments(documents);
      writeLocalDocuments(documents);
      return sortDocuments(documents);
    }

    const migratedLocalDocuments = await migrateLegacyStarterDocuments(localDocuments);
    await Promise.allSettled(migratedLocalDocuments.map(saveDocumentToIndexedDb));
    return sortDocuments(migratedLocalDocuments);
  } catch {
    return sortDocuments(await migrateLegacyStarterDocuments(localDocuments));
  }
}

async function migrateLegacyStarterDocuments(documents) {
  const now = new Date().toISOString();
  const nextDocuments = documents.map((document) => {
    if (!isLegacyStarterDocument(document)) return document;

    return {
      ...document,
      title: starterDocument.title,
      content: starterDocument.content,
      updatedAt: now,
    };
  });

  if (nextDocuments.some((document, index) => document !== documents[index])) {
    writeLocalDocuments(nextDocuments);
    await Promise.allSettled(nextDocuments.map(saveDocumentToIndexedDb));
  }

  return nextDocuments;
}

export async function saveDocument(document) {
  const documents = readLocalDocuments();
  const nextDocuments = documents.some((item) => item.id === document.id)
    ? documents.map((item) => (item.id === document.id ? document : item))
    : [document, ...documents];

  writeLocalDocuments(nextDocuments);

  try {
    await saveDocumentToIndexedDb(document);
  } catch {
    
  }

  return document;
}

export async function removeDocument(id) {
  writeLocalDocuments(readLocalDocuments().filter((document) => document.id !== id));

  try {
    await runStore("readwrite", (store) => store.delete(id));
  } catch {
    
  }
}

export function sortDocuments(documents) {
  return [...documents].sort(
    (first, second) =>
      new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime(),
  );
}
