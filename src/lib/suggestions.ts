import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export type SuggestionInput = {
  name: string;
  contact: string;
  request: string;
};

export function postSuggestion({ name, contact, request }: SuggestionInput) {
  return addDoc(collection(db, "suggestions"), {
    name: name.trim(),
    contact: contact.trim(),
    request: request.trim(),
    createdAt: serverTimestamp(),
  });
}
