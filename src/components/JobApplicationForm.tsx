import { AlertCircle, CheckCircle2, Clock3, LogOut, Mail, Pencil, Save, Send, ShieldCheck, XCircle } from "lucide-react";
import { FormEvent, useEffect, useState, type CSSProperties } from "react";
import { useAuth } from "../context/AuthContext";
import { roles } from "../data/siteData";
import {
  applicantEmailStorageKey,
  completeApplicantSignInLink,
  isApplicantSignInLink,
  sendApplicantSignInLink,
  signOutMember,
} from "../lib/firebase";
import {
  saveJobApplication,
  watchApplicantApplication,
  type JobApplication,
  type JobApplicationInput,
  type JobApplicationStatus,
} from "../lib/jobApplications";
import { SectionHeader } from "./SectionHeader";

const emptyForm: JobApplicationInput = {
  name: "",
  contact: "",
  role: roles[0] ?? "",
  robloxUsername: "",
  portfolioUrl: "",
  experience: "",
  reason: "",
};

const statusCopy: Record<JobApplicationStatus, { title: string; text: string; tone: string }> = {
  pending: {
    title: "Application submitted",
    text: "Your application is saved. Gambox can review it, and you can come back here to check your status.",
    tone: "text-violet-700",
  },
  accepted: {
    title: "You have been accepted",
    text: "Gambox reviewed your application and marked it accepted. Keep an eye on your contact method for next steps.",
    tone: "text-emerald-700",
  },
  declined: {
    title: "Application declined",
    text: "Gambox reviewed your application and declined it for now. You can send a fresh application when you are ready.",
    tone: "text-amber-700",
  },
};

export function JobApplicationForm() {
  const { user, loading: authLoading } = useAuth();
  const applicant = user && !user.isAnonymous && user.email ? user : null;
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [form, setForm] = useState<JobApplicationInput>(emptyForm);
  const [editing, setEditing] = useState(false);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginSent, setLoginSent] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [needsLinkEmail, setNeedsLinkEmail] = useState(false);
  const [completingLink, setCompletingLink] = useState(false);

  useEffect(() => {
    if (!isApplicantSignInLink()) return;

    const storedEmail = window.localStorage.getItem(applicantEmailStorageKey);
    if (!storedEmail) {
      setNeedsLinkEmail(true);
      return;
    }

    setCompletingLink(true);
    completeApplicantSignIn(storedEmail);
  }, []);

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};

    if (!applicant) {
      setApplication(null);
      setApplicationLoading(false);
      return unsubscribe;
    }

    setApplicationLoading(true);
    setError("");

    unsubscribe = watchApplicantApplication(
      applicant.uid,
      (nextApplication) => {
        if (!active) return;

        setApplication(nextApplication);
        if (nextApplication) {
          setForm(toForm(nextApplication));
          setEditing(false);
        } else {
          setForm(emptyForm);
          setEditing(true);
        }
        setApplicationLoading(false);
      },
      (message) => {
        if (!active) return;

        setError(message);
        setApplicationLoading(false);
      },
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [applicant?.uid]);

  async function completeApplicantSignIn(email: string) {
    setLoginLoading(true);
    setLoginError("");

    try {
      await completeApplicantSignInLink(email);
      setNeedsLinkEmail(false);
      window.history.replaceState({}, document.title, "/careers");
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Sign-in link could not be completed.");
      setNeedsLinkEmail(true);
    } finally {
      setCompletingLink(false);
      setLoginLoading(false);
    }
  }

  async function handleSendLoginLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!loginEmail.trim()) {
      setLoginError("Enter your email to get the sign-in link.");
      return;
    }

    setLoginLoading(true);
    setLoginError("");
    setLoginSent(false);

    try {
      await sendApplicantSignInLink(loginEmail);
      setLoginSent(true);
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Sign-in link could not be sent.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleCompleteLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!loginEmail.trim()) {
      setLoginError("Enter the same email you used for the sign-in link.");
      return;
    }

    setCompletingLink(true);
    await completeApplicantSignIn(loginEmail);
  }

  function updateField(field: keyof JobApplicationInput, value: string) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setSaved(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!applicant) {
      setError("Sign in with email before submitting an application.");
      return;
    }

    if (!form.name.trim() || !form.contact.trim() || !form.role.trim() || !form.experience.trim() || !form.reason.trim()) {
      setError("Please fill in name, contact, role, experience, and why we should remember you.");
      return;
    }

    setSaving(true);
    setError("");
    setSaved(false);

    try {
      await saveJobApplication(applicant, form, application);
      setSaved(true);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Application could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  function startReapply() {
    setForm(application ? toForm(application) : emptyForm);
    setSaved(false);
    setError("");
    setEditing(true);
  }

  const canEdit = application?.status === "pending";
  const canReapply = application?.status === "declined";

  return (
    <section id="application" className="px-5 py-24">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="Application"
          title="Apply to join Gambox."
          text="Sign in with email, submit your application, and come back later to check your status."
        />

        {authLoading || completingLink ? (
          <div className="section-panel mx-auto max-w-3xl p-8 text-center font-bold text-slate-600">Signing you in...</div>
        ) : !applicant ? (
          <ApplicantLoginPanel
            email={loginEmail}
            sent={loginSent}
            loading={loginLoading}
            error={loginError}
            needsLinkEmail={needsLinkEmail}
            onEmailChange={setLoginEmail}
            onSendLink={handleSendLoginLink}
            onCompleteLink={handleCompleteLink}
          />
        ) : (
          <>
            <div className="section-panel mx-auto mb-6 flex max-w-3xl flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-200/55 bg-white/60 text-violet-700 shadow-lg shadow-violet-950/5 backdrop-blur-xl">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-700">Applicant account</p>
                  <p className="break-all text-sm font-bold text-slate-700">{applicant.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => signOutMember()}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-200/45 bg-white/55 px-5 py-3 text-sm font-black text-violet-700 shadow-lg shadow-violet-950/5 backdrop-blur-xl transition hover:bg-white/75"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>

            {applicationLoading ? (
              <div className="section-panel mx-auto max-w-3xl p-8 text-center font-bold text-slate-600">Loading your application...</div>
            ) : error && !editing && !application ? (
              <div className="section-panel mx-auto max-w-3xl p-8 text-center md:p-12">
                <AlertCircle className="mx-auto text-amber-700" size={40} />
                <h3 className="mt-5 text-3xl font-black text-slate-950">Application system unavailable</h3>
                <p className="mt-4 leading-8 text-slate-600">{error}</p>
              </div>
            ) : application && !editing ? (
              <ApplicationStatus
                application={application}
                onEdit={() => setEditing(true)}
                onReapply={startReapply}
                canEdit={canEdit}
                canReapply={canReapply}
                saved={saved}
              />
            ) : (
              <ApplicationEditor
                form={form}
                application={application}
                error={error}
                saving={saving}
                onSubmit={handleSubmit}
                onCancel={() => {
                  if (application) {
                    setForm(toForm(application));
                    setEditing(false);
                    setError("");
                  }
                }}
                onUpdate={updateField}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}

function ApplicantLoginPanel({
  email,
  sent,
  loading,
  error,
  needsLinkEmail,
  onEmailChange,
  onSendLink,
  onCompleteLink,
}: {
  email: string;
  sent: boolean;
  loading: boolean;
  error: string;
  needsLinkEmail: boolean;
  onEmailChange: (email: string) => void;
  onSendLink: (event: FormEvent<HTMLFormElement>) => void;
  onCompleteLink: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="section-panel mx-auto grid max-w-4xl overflow-hidden rounded-[2rem] lg:grid-cols-[.95fr_1.05fr]">
      <div className="bg-[linear-gradient(135deg,rgba(124,58,237,.14),rgba(251,191,36,.12),transparent)] p-8 md:p-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-[1.4rem] border border-violet-200/55 bg-white/65 text-violet-700 shadow-lg shadow-violet-950/10 backdrop-blur-xl">
          <Mail size={30} />
        </div>
        <h3 className="mt-7 text-4xl font-black text-slate-950">{needsLinkEmail ? "Finish sign in." : "Applicant sign in."}</h3>
        <p className="mt-4 leading-8 text-slate-600">
          {needsLinkEmail
            ? "Enter the same email you used for the sign-in link so your account can finish loading."
            : "Get a secure sign-in link. Your application will stay connected to this email account."}
        </p>
      </div>

      <form onSubmit={needsLinkEmail ? onCompleteLink : onSendLink} className="p-8 md:p-10">
        <label className="mb-2 block text-sm font-black uppercase tracking-[0.2em] text-violet-700">Email</label>
        <input
          type="email"
          value={email}
          autoComplete="email"
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="you@example.com"
          className="form-field mb-5"
          required
        />

        {sent && (
          <div className="mb-5 rounded-[1.4rem] border border-emerald-200 bg-emerald-50/75 px-5 py-4 text-sm font-bold text-emerald-700">
            Sign-in link sent. Open it from your email to continue your application.
          </div>
        )}

        {error && <p className="mb-5 rounded-[1.4rem] border border-amber-200 bg-amber-50/75 px-5 py-4 text-sm font-bold text-amber-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-amber-500/35 bg-amber-300/70 px-7 py-4 font-black text-slate-950 shadow-lg shadow-amber-400/20 backdrop-blur-xl transition hover:bg-amber-300/85 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Working..." : needsLinkEmail ? "Complete Sign In" : "Send Sign-In Link"}
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

function ApplicationStatus({
  application,
  onEdit,
  onReapply,
  canEdit,
  canReapply,
  saved,
}: {
  application: JobApplication;
  onEdit: () => void;
  onReapply: () => void;
  canEdit: boolean;
  canReapply: boolean;
  saved: boolean;
}) {
  const copy = statusCopy[application.status];
  const Icon = application.status === "declined" ? XCircle : application.status === "accepted" ? CheckCircle2 : Clock3;

  return (
    <div className="section-panel mx-auto max-w-3xl p-6 text-center md:p-10">
      <div className="application-success-burst mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] border border-violet-200/55 bg-white/60 shadow-lg shadow-violet-950/10 backdrop-blur-xl">
        {Array.from({ length: 8 }).map((_, index) => (
          <span key={index} className="application-success-particle" style={{ "--particle-index": index } as CSSProperties} />
        ))}
        <Icon className={copy.tone} size={42} />
      </div>
      <p className={`mt-6 text-sm font-black uppercase tracking-[0.28em] ${copy.tone}`}>{application.status}</p>
      <h3 className="mt-3 text-4xl font-black text-slate-950 md:text-5xl">{copy.title}</h3>
      <p className="mx-auto mt-4 max-w-xl leading-8 text-slate-600">{copy.text}</p>

      <div className="mt-8 grid gap-3 rounded-[1.5rem] border border-violet-200/45 bg-white/40 p-5 text-left backdrop-blur-xl">
        <StatusLine label="Name" value={application.name} />
        <StatusLine label="Role" value={application.role} />
        <StatusLine label="Account" value={application.applicantEmail || "Signed in with email"} />
        <StatusLine label="Contact" value={application.contact} />
        {application.robloxUsername && <StatusLine label="Roblox" value={application.robloxUsername} />}
        {application.portfolioUrl && <StatusLine label="Work link" value={application.portfolioUrl} />}
      </div>

      <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
        {canEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-200/45 bg-white/55 px-6 py-3 font-black text-violet-700 shadow-lg shadow-violet-950/5 backdrop-blur-xl transition hover:bg-white/75"
          >
            Edit Application <Pencil size={17} />
          </button>
        )}
        {canReapply && (
          <button
            type="button"
            onClick={onReapply}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-500/35 bg-amber-300/70 px-6 py-3 font-black text-slate-950 shadow-lg shadow-amber-400/20 backdrop-blur-xl transition hover:bg-amber-300/85"
          >
            Apply Again <Send size={17} />
          </button>
        )}
        {saved && <p className="text-sm font-bold text-violet-700">Changes saved.</p>}
      </div>
    </div>
  );
}

function ApplicationEditor({
  form,
  application,
  error,
  saving,
  onSubmit,
  onCancel,
  onUpdate,
}: {
  form: JobApplicationInput;
  application: JobApplication | null;
  error: string;
  saving: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onUpdate: (field: keyof JobApplicationInput, value: string) => void;
}) {
  const isReapplying = application?.status === "declined";

  return (
    <form onSubmit={onSubmit} className="section-panel mx-auto grid max-w-3xl gap-5 p-6 md:grid-cols-2 md:p-8">
      {isReapplying && (
        <div className="rounded-[1.35rem] border border-amber-200 bg-amber-50/70 p-5 text-sm font-bold leading-7 text-amber-800 md:col-span-2">
          This will replace your declined application with a fresh pending application for Gambox to review.
        </div>
      )}

      <label className="grid gap-2">
        <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-600">Name required</span>
        <input value={form.name} onChange={(event) => onUpdate("name", event.target.value)} required maxLength={80} placeholder="Your name" className="form-field" />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-600">Contact required</span>
        <input value={form.contact} onChange={(event) => onUpdate("contact", event.target.value)} required maxLength={120} placeholder="Email or Discord username" className="form-field" />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-black uppercase tracking-[0.2em] text-violet-700">Role required</span>
        <select value={form.role} onChange={(event) => onUpdate("role", event.target.value)} required className="form-field">
          {roles.map((roleName) => (
            <option key={roleName} value={roleName}>
              {roleName}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-600">Roblox username</span>
        <input value={form.robloxUsername} onChange={(event) => onUpdate("robloxUsername", event.target.value)} maxLength={80} placeholder="Optional" className="form-field" />
      </label>

      <label className="grid gap-2 md:col-span-2">
        <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-600">Portfolio or work link</span>
        <input value={form.portfolioUrl} onChange={(event) => onUpdate("portfolioUrl", event.target.value)} maxLength={240} placeholder="Roblox profile, YouTube, portfolio, Drive folder, or social link" className="form-field" />
      </label>

      <label className="grid gap-2 md:col-span-2">
        <span className="text-sm font-black uppercase tracking-[0.2em] text-violet-700">Experience required</span>
        <textarea value={form.experience} onChange={(event) => onUpdate("experience", event.target.value)} required maxLength={1200} rows={5} placeholder="What have you built, managed, animated, promoted, edited, or helped ship?" className="form-field resize-y" />
      </label>

      <label className="grid gap-2 md:col-span-2">
        <span className="text-sm font-black uppercase tracking-[0.2em] text-violet-700">Why should we remember you? required</span>
        <textarea value={form.reason} onChange={(event) => onUpdate("reason", event.target.value)} required maxLength={1200} rows={5} placeholder="Tell us why you fit this role and what you would improve first." className="form-field resize-y" />
      </label>

      <div className="grid gap-3 md:col-span-2">
        <button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-500/35 bg-amber-300/70 px-7 py-4 font-black text-slate-950 shadow-lg shadow-amber-400/20 backdrop-blur-xl transition hover:bg-amber-300/85 disabled:cursor-not-allowed disabled:opacity-60">
          {saving ? "Saving..." : application?.status === "pending" ? "Save application" : isReapplying ? "Submit fresh application" : "Submit application"}
          {application?.status === "pending" ? <Save size={18} /> : <Send size={18} />}
        </button>

        {application && (
          <button type="button" onClick={onCancel} className="inline-flex items-center justify-center rounded-full border border-violet-200/45 bg-white/55 px-7 py-4 font-black text-violet-700 shadow-lg shadow-violet-950/5 backdrop-blur-xl transition hover:bg-white/75">
            Cancel
          </button>
        )}

        {error && <p className="text-sm font-bold text-amber-700">{error}</p>}
      </div>
    </form>
  );
}

function StatusLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[9rem_1fr] sm:gap-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-700">{label}</p>
      <p className="break-words font-bold text-slate-700">{value}</p>
    </div>
  );
}

function toForm(application: JobApplication): JobApplicationInput {
  return {
    name: application.name,
    contact: application.contact,
    role: application.role || roles[0] || "",
    robloxUsername: application.robloxUsername,
    portfolioUrl: application.portfolioUrl,
    experience: application.experience,
    reason: application.reason,
  };
}
