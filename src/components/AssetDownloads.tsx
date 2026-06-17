import { Download, FileDown, Lock, LogOut } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import {
  builtInDownloadAssets,
  type DownloadAsset,
  watchDownloadAssets,
} from "../lib/downloadAssets";
import { signInMember, signOutMember } from "../lib/firebase";
import { SectionHeader } from "./SectionHeader";

export function AssetDownloads() {
  const { user, loading: authLoading } = useAuth();
  const memberUser = user && !user.isAnonymous ? user : null;
  const [uploadedAssets, setUploadedAssets] = useState<DownloadAsset[]>([]);
  const [loadError, setLoadError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const assets = useMemo(() => [...uploadedAssets, ...builtInDownloadAssets], [uploadedAssets]);

  useEffect(() => {
    if (!memberUser) {
      setUploadedAssets([]);
      setLoadError("");
      return;
    }

    return watchDownloadAssets(setUploadedAssets, setLoadError);
  }, [memberUser]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      await signInMember(email, password);
      setPassword("");
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleSignOut() {
    await signOutMember();
  }

  function canPreview(asset: DownloadAsset) {
    return Boolean(asset.contentType?.startsWith("image/") || /\.(png|jpe?g|webp|svg|gif|ico)$/i.test(asset.fileName));
  }

  function assetTypeLabel(asset: DownloadAsset) {
    const extension = asset.fileName.split(".").pop();

    if (extension) return extension.toUpperCase();
    if (asset.contentType?.includes("/")) return asset.contentType.split("/").pop()?.toUpperCase() ?? "ASSET";
    return asset.contentType?.toUpperCase() || "ASSET";
  }

  return (
    <section id="assets" className="scroll-mt-24 px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Downloads"
          title="Asset downloads in one place."
          text="Members can grab logos, icons, game art, and other files without hunting through messages or folders."
        />

        {authLoading ? (
          <div className="section-panel mx-auto max-w-3xl p-8 text-center font-bold text-slate-600">Checking member access...</div>
        ) : !memberUser ? (
          <div className="section-panel mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] lg:grid-cols-[.9fr_1.1fr]">
            <div className="rounded-t-[2rem] bg-[linear-gradient(135deg,rgba(251,191,36,.14),rgba(14,165,233,.08),transparent)] p-8 md:rounded-l-[2rem] md:rounded-tr-none md:p-10">
              <Lock className="mb-6 text-violet-700" size={42} />
              <h3 className="text-3xl font-black text-slate-950">Members only</h3>
              <p className="mt-4 leading-8 text-slate-600">
                Log in to view and download Gambox assets.
              </p>
            </div>

            <form onSubmit={handleLogin} className="p-8 md:p-10">
              <label className="mb-2 block text-sm font-bold text-slate-600">Email</label>
              <input
                type="email"
                value={email}
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                className="mb-4 w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 outline-none ring-violet-200/0 transition focus:ring-4"
              />

              <label className="mb-2 block text-sm font-bold text-slate-600">Password</label>
              <input
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
                className="mb-5 w-full rounded-2xl border border-slate-300 bg-white px-4 py-4 outline-none ring-violet-200/0 transition focus:ring-4"
              />

              {loginError && <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{loginError}</p>}

              <button type="submit" disabled={loginLoading} className="w-full rounded-full border border-amber-500/35 bg-amber-300/70 px-5 py-4 font-black text-slate-950 shadow-lg shadow-amber-400/20 backdrop-blur-xl transition hover:bg-amber-300/85 disabled:opacity-60">
                {loginLoading ? "Logging in..." : "Log In To View Assets"}
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_14px_40px_rgba(70,48,130,0.08)] md:flex-row md:items-center">
              <p className="text-sm font-bold text-slate-600">Signed in as {memberUser.displayName || memberUser.email}</p>
              <button onClick={handleSignOut} className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-200/45 bg-white/35 px-4 py-3 text-sm font-bold text-slate-950 backdrop-blur-xl hover:bg-white/60">
                <LogOut size={16} /> Sign Out
              </button>
            </div>

            {loadError && <p className="mb-5 text-center text-sm font-bold text-amber-700">Uploaded assets could not load: {loadError}</p>}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {assets.map((asset) => (
                <article key={asset.id} className="section-panel flex min-h-[20rem] flex-col overflow-hidden">
                  <div className="asset-preview">
                    {canPreview(asset) ? (
                      <img src={asset.downloadUrl} alt={asset.title} className="asset-preview-image" loading="lazy" />
                    ) : (
                      <div className="grid h-full w-full place-items-center rounded-2xl bg-slate-50 text-slate-500">
                        <FileDown size={48} />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-violet-700">{assetTypeLabel(asset)}</p>
                      <h3 className="mt-2 text-lg font-black leading-tight text-slate-950">{asset.title}</h3>
                      {asset.description && <p className="mt-2 text-sm leading-6 text-slate-600">{asset.description}</p>}
                      <p className="mt-3 break-all text-xs font-semibold text-slate-500">{asset.fileName}</p>
                    </div>
                    <a
                      href={asset.downloadUrl}
                      download={asset.fileName}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-amber-500/35 bg-amber-300/70 px-4 py-3 text-sm font-black text-slate-950 shadow-lg shadow-amber-400/20 backdrop-blur-xl transition hover:bg-amber-300/85"
                    >
                      Download <Download size={16} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

