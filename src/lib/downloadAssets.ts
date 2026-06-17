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
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "./firebase";

export const assetAdminEmail = "olerblaine@gmail.com";

export type DownloadAsset = {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  downloadUrl: string;
  storagePath?: string;
  contentType?: string;
  createdAt?: {
    seconds: number;
  } | null;
};

export const builtInDownloadAssets: DownloadAsset[] = [
  {
    id: "black-icon-on-white",
    title: "Black Icon on White",
    description: "Gambox mark with a black app tile on a white background.",
    fileName: "gambox-black-icon-on-white.png",
    downloadUrl: "/downloads/gambox-black-icon-on-white.png",
    contentType: "image/png",
  },
  {
    id: "white-icon-on-black",
    title: "White Icon on Black",
    description: "Gambox mark with a white app tile on a black background.",
    fileName: "gambox-white-icon-on-black.png",
    downloadUrl: "/downloads/gambox-white-icon-on-black.png",
    contentType: "image/png",
  },
  {
    id: "standalone-transparent-icon",
    title: "Transparent Standalone Icon",
    description: "Transparent-background Gambox icon for overlays and layouts.",
    fileName: "gambox-transparent-standalone-icon.png",
    downloadUrl: "/downloads/gambox-transparent-standalone-icon.png",
    contentType: "image/png",
  },
  {
    id: "orange-background-black-icon",
    title: "Orange Background Black Icon",
    description: "Black app tile version on the orange Gambox background.",
    fileName: "gambox-black-icon-orange-background.png",
    downloadUrl: "/downloads/gambox-black-icon-orange-background.png",
    contentType: "image/png",
  },
  {
    id: "cyan-background-icon",
    title: "Cyan Background Icon",
    description: "White app tile with cyan Gambox mark on a cyan background.",
    fileName: "gambox-cyan-icon-background.png",
    downloadUrl: "/downloads/gambox-cyan-icon-background.png",
    contentType: "image/png",
  },
  {
    id: "development-lockup-white",
    title: "Development Lockup on White",
    description: "Gambox Development logo lockup on a white background.",
    fileName: "gambox-development-lockup-white.png",
    downloadUrl: "/downloads/gambox-development-lockup-white.png",
    contentType: "image/png",
  },
  {
    id: "development-lockup-black",
    title: "Development Lockup on Black",
    description: "Gambox Development logo lockup on a black background.",
    fileName: "gambox-development-lockup-black.png",
    downloadUrl: "/downloads/gambox-development-lockup-black.png",
    contentType: "image/png",
  },
  {
    id: "development-lockup-orange",
    title: "Development Lockup on Orange",
    description: "White Gambox Development logo lockup on orange.",
    fileName: "gambox-development-lockup-orange.png",
    downloadUrl: "/downloads/gambox-development-lockup-orange.png",
    contentType: "image/png",
  },
  {
    id: "development-lockup-blue",
    title: "Development Lockup on Blue",
    description: "White Gambox Development logo lockup on blue.",
    fileName: "gambox-development-lockup-blue.png",
    downloadUrl: "/downloads/gambox-development-lockup-blue.png",
    contentType: "image/png",
  },
  {
    id: "gambox-brand-icon",
    title: "Orange App Icon",
    description: "Main orange Gambox app icon for site and social use.",
    fileName: "gambox-brand-icon.png",
    downloadUrl: "/downloads/gambox-brand-icon.png",
    contentType: "image/png",
  },
  {
    id: "gambox-icon-512",
    title: "Orange App Icon 512",
    description: "Large app icon for profiles, thumbnails, and touch icons.",
    fileName: "gambox-orange-app-icon-512.png",
    downloadUrl: "/downloads/gambox-orange-app-icon-512.png",
    contentType: "image/png",
  },
  {
    id: "gambox-icon-192",
    title: "Orange App Icon 192",
    description: "Smaller app icon for web and platform use.",
    fileName: "gambox-orange-app-icon-192.png",
    downloadUrl: "/downloads/gambox-orange-app-icon-192.png",
    contentType: "image/png",
  },
  {
    id: "gambox-favicon",
    title: "Gambox Favicon",
    description: "ICO favicon file for browser tabs.",
    fileName: "favicon.ico",
    downloadUrl: "/downloads/favicon.ico",
    contentType: "image/x-icon",
  },
  {
    id: "grimwood-key-art",
    title: "Grimwood Blackout Key Art",
    description: "Current game key art used on the Gambox site.",
    fileName: "grimwood-blackout-key-art.png",
    downloadUrl: "/downloads/grimwood-blackout-key-art.png",
    contentType: "image/png",
  },
];

function toDownloadAsset(snapshot: QueryDocumentSnapshot<DocumentData>): DownloadAsset {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    title: String(data.title ?? "Download Asset"),
    description: typeof data.description === "string" ? data.description : undefined,
    fileName: String(data.fileName ?? "asset"),
    downloadUrl: String(data.downloadUrl ?? ""),
    storagePath: typeof data.storagePath === "string" ? data.storagePath : undefined,
    contentType: typeof data.contentType === "string" ? data.contentType : undefined,
    createdAt: data.createdAt ?? null,
  };
}

export function watchDownloadAssets(onUpdate: (items: DownloadAsset[]) => void, onError: (message: string) => void): Unsubscribe {
  const assetsQuery = query(collection(db, "downloadAssets"), orderBy("createdAt", "desc"));

  return onSnapshot(
    assetsQuery,
    (snapshot) => onUpdate(snapshot.docs.map(toDownloadAsset)),
    (error) => onError(error.message),
  );
}

export async function uploadDownloadAsset(file: File, title: string, description: string) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const storagePath = `download-assets/${Date.now()}-${safeName}`;
  const assetRef = ref(storage, storagePath);

  await uploadBytes(assetRef, file, {
    contentType: file.type || "application/octet-stream",
  });

  const downloadUrl = await getDownloadURL(assetRef);

  return addDoc(collection(db, "downloadAssets"), {
    title: title.trim() || file.name,
    description: description.trim(),
    fileName: file.name,
    downloadUrl,
    storagePath,
    contentType: file.type || "application/octet-stream",
    createdAt: serverTimestamp(),
  });
}

export function addDownloadAssetLink(title: string, description: string, fileName: string, downloadUrl: string) {
  return addDoc(collection(db, "downloadAssets"), {
    title: title.trim(),
    description: description.trim(),
    fileName: fileName.trim(),
    downloadUrl: downloadUrl.trim(),
    contentType: "external/link",
    createdAt: serverTimestamp(),
  });
}
