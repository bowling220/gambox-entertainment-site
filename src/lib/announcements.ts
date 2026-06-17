import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";

export type Announcement = {
  id: string;
  title: string;
  body: string;
  date?: string;
  href?: string;
  linkLabel?: string;
  createdAt?: {
    seconds: number;
  } | null;
};

function toAnnouncement(snapshot: QueryDocumentSnapshot<DocumentData>): Announcement {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    title: String(data.title ?? "Announcement"),
    body: String(data.body ?? ""),
    href: typeof data.href === "string" ? data.href : undefined,
    linkLabel: typeof data.linkLabel === "string" ? data.linkLabel : undefined,
    createdAt: data.createdAt ?? null,
  };
}

export function watchAnnouncements(onUpdate: (items: Announcement[]) => void, onError: (message: string) => void): Unsubscribe {
  const announcementQuery = query(collection(db, "announcements"), orderBy("createdAt", "desc"));

  return onSnapshot(
    announcementQuery,
    (snapshot) => onUpdate(snapshot.docs.map(toAnnouncement)),
    (error) => onError(error.message),
  );
}

export function postAnnouncement(title: string, body: string) {
  return addDoc(collection(db, "announcements"), {
    title: title.trim(),
    body: body.trim(),
    createdAt: serverTimestamp(),
  });
}
