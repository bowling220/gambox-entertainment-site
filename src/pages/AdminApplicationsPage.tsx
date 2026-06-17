import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Trash2,
  ExternalLink,
  Eye,
  Filter,
  LogOut,
  Mail,
  Search,
  ShieldCheck,
  UserRound,
  X,
  XCircle,
} from "lucide-react";
import { FormEvent, MouseEvent, useEffect, useMemo, useState, type ReactNode } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { useAuth } from "../context/AuthContext";
import { roles } from "../data/siteData";
import { signInMember, signOutMember } from "../lib/firebase";
import {
  deleteJobApplication,
  updateJobApplicationStatus,
  watchJobApplications,
  type JobApplication,
  type JobApplicationStatus,
} from "../lib/jobApplications";

type StatusFilter = "all" | JobApplicationStatus;

const statusFilters: StatusFilter[] = ["all", "pending", "accepted", "declined"];

export function AdminApplicationsPage() {
  const { user, loading: authLoading, admin, adminLoading } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loadError, setLoadError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const memberUser = user && !user.isAnonymous ? user : null;
  const selectedApplication = applications.find((application) => application.id === selectedId) ?? null;

  useEffect(() => {
    if (!memberUser || !admin) {
      setApplications([]);
      setLoadError("");
      return;
    }

    return watchJobApplications(setApplications, setLoadError);
  }, [memberUser, admin]);

  useEffect(() => {
    if (selectedId && !selectedApplication) setSelectedId("");
  }, [selectedId, selectedApplication]);

  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((application) => application.status === "pending").length,
      accepted: applications.filter((application) => application.status === "accepted").length,
      declined: applications.filter((application) => application.status === "declined").length,
    };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return applications.filter((application) => {
      if (statusFilter !== "all" && application.status !== statusFilter) return false;
      if (roleFilter !== "all" && application.role !== roleFilter) return false;

      if (!normalizedSearch) return true;

      return [
        application.name,
        application.applicantEmail,
        application.contact,
        application.robloxUsername,
        application.role,
        application.reason,
        application.experience,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [applications, roleFilter, search, statusFilter]);

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

  async function updateStatus(applicationId: string, status: JobApplicationStatus) {
    if (!memberUser) return;

    setUpdatingId(applicationId);
    try {
      await updateJobApplicationStatus(applicationId, status, memberUser);
    } finally {
      setUpdatingId("");
    }
  }

  async function deleteApplication(application: JobApplication) {
    if (application.status !== "declined") return;
    const confirmed = window.confirm(`Delete ${application.name || "this applicant"}'s declined application? This cannot be undone.`);
    if (!confirmed) return;

    setDeletingId(application.id);
    try {
      await deleteJobApplication(application.id);
      if (selectedId === application.id) setSelectedId("");
    } finally {
      setDeletingId("");
    }
  }

  function handleQuickAction(event: MouseEvent<HTMLButtonElement>, applicationId: string, status: JobApplicationStatus) {
    event.stopPropagation();
    updateStatus(applicationId, status);
  }

  function handleDeleteAction(event: MouseEvent<HTMLButtonElement>, application: JobApplication) {
    event.stopPropagation();
    deleteApplication(application);
  }

  return (
    <section className="page-section px-5">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Admin"
          title="Applications dashboard."
          text="Search, filter, and review Gambox hiring applications from one clean workspace."
        />

        {authLoading ? (
          <div className="section-panel mx-auto max-w-3xl p-8 text-center font-bold text-slate-600">Checking admin session...</div>
        ) : !memberUser ? (
          <AdminLoginPanel
            email={email}
            password={password}
            loading={loginLoading}
            error={loginError}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleLogin}
          />
        ) : adminLoading ? (
          <div className="section-panel mx-auto max-w-3xl p-8 text-center font-bold text-slate-600">Checking admin access...</div>
        ) : !admin ? (
          <div className="section-panel mx-auto max-w-3xl p-8 text-center md:p-12">
            <ShieldCheck className="mx-auto text-amber-700" size={40} />
            <h3 className="mt-5 text-3xl font-black text-slate-950">Admin access required</h3>
            <p className="mt-4 leading-8 text-slate-600">This account is signed in, but admin access is reserved for olerblaine@gmail.com.</p>
            <button onClick={() => signOutMember()} className="mt-7 inline-flex items-center justify-center gap-2 rounded-full border border-violet-200/45 bg-white/55 px-6 py-3 font-black text-violet-700 shadow-lg shadow-violet-950/5 backdrop-blur-xl transition hover:bg-white/75">
              <LogOut size={17} /> Sign Out
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex flex-col justify-between gap-4 rounded-[1.75rem] border border-violet-200/45 bg-white/55 p-4 shadow-[0_14px_40px_rgba(70,48,130,0.08)] backdrop-blur-xl lg:flex-row lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-violet-700">Signed in</p>
                <p className="mt-1 break-all text-sm font-bold text-slate-600">{memberUser.displayName || memberUser.email}</p>
              </div>
              <button onClick={() => signOutMember()} className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-200/45 bg-white/35 px-4 py-3 text-sm font-bold text-slate-950 backdrop-blur-xl hover:bg-white/60">
                <LogOut size={16} /> Sign Out
              </button>
            </div>

            {loadError && <p className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">Applications could not load: {loadError}</p>}

            <div className="mb-6 grid gap-4 md:grid-cols-4">
              <StatCard label="Total" value={stats.total} tone="text-slate-950" />
              <StatCard label="Pending" value={stats.pending} tone="text-violet-700" />
              <StatCard label="Accepted" value={stats.accepted} tone="text-emerald-700" />
              <StatCard label="Declined" value={stats.declined} tone="text-amber-700" />
            </div>

            <div className="section-panel mb-6 p-4 md:p-5">
              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-violet-700" size={18} />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search applicants, emails, roles, Roblox usernames, or notes"
                    className="form-field admin-search-field"
                  />
                </label>

                <label className="flex items-center gap-3 rounded-full border border-violet-200/45 bg-white/55 px-4 py-3 shadow-lg shadow-violet-950/5 backdrop-blur-xl">
                  <Filter size={17} className="text-violet-700" />
                  <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="bg-transparent text-sm font-black text-slate-700 outline-none">
                    <option value="all">All roles</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {statusFilters.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-full border px-4 py-2 text-sm font-black capitalize transition ${
                      statusFilter === status
                        ? "border-violet-400 bg-violet-700 text-white shadow-lg shadow-violet-950/15"
                        : "border-violet-200/45 bg-white/45 text-slate-700 hover:bg-white/70"
                    }`}
                  >
                    {status} {status === "all" ? stats.total : stats[status]}
                  </button>
                ))}
              </div>
            </div>

            <div className="section-panel overflow-hidden p-0">
              <div className="border-b border-violet-200/35 px-5 py-4">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-700">{filteredApplications.length} shown</p>
              </div>

              {filteredApplications.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-2xl font-black text-slate-950">No matching applications</p>
                  <p className="mt-3 text-sm font-bold text-slate-500">Try another search, status, or role filter.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[980px] border-collapse text-left">
                    <thead className="bg-white/45 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                      <tr>
                        <th className="px-5 py-4">Applicant</th>
                        <th className="px-5 py-4">Role</th>
                        <th className="px-5 py-4">Status</th>
                        <th className="px-5 py-4">Submitted</th>
                        <th className="px-5 py-4">Contact</th>
                        <th className="px-5 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplications.map((application) => (
                        <tr
                          key={application.id}
                          onClick={() => setSelectedId(application.id)}
                          className="cursor-pointer border-t border-violet-200/35 transition hover:bg-white/45"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-200/55 bg-white/65 text-violet-700">
                                <UserRound size={18} />
                              </div>
                              <div>
                                <p className="font-black text-slate-950">{application.name || "Unnamed applicant"}</p>
                                <p className="mt-1 max-w-64 truncate text-xs font-bold text-slate-500">{application.applicantEmail || "No account email"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <p className="max-w-52 truncate font-bold text-slate-700">{application.role}</p>
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge status={application.status} />
                          </td>
                          <td className="px-5 py-4 text-sm font-bold text-slate-500">{formatDate(application.createdAt)}</td>
                          <td className="px-5 py-4">
                            <p className="max-w-52 truncate text-sm font-bold text-slate-600">{application.contact}</p>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setSelectedId(application.id);
                                }}
                                className="inline-flex items-center justify-center rounded-full border border-violet-200/45 bg-white/55 p-3 text-violet-700 hover:bg-white/80"
                                aria-label={`Review ${application.name}`}
                              >
                                <Eye size={16} />
                              </button>
                              <QuickStatusButton
                                status="accepted"
                                currentStatus={application.status}
                                disabled={updatingId === application.id}
                                onClick={(event) => handleQuickAction(event, application.id, "accepted")}
                              />
                              <QuickStatusButton
                                status="declined"
                                currentStatus={application.status}
                                disabled={updatingId === application.id}
                                onClick={(event) => handleQuickAction(event, application.id, "declined")}
                              />
                              {application.status === "declined" && (
                                <button
                                  type="button"
                                  onClick={(event) => handleDeleteAction(event, application)}
                                  disabled={deletingId === application.id}
                                  className="inline-flex items-center justify-center rounded-full border border-red-200/70 bg-red-50/80 p-3 text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                  aria-label={`Delete ${application.name}`}
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          updating={updatingId === selectedApplication.id}
          deleting={deletingId === selectedApplication.id}
          onClose={() => setSelectedId("")}
          onUpdateStatus={(status) => updateStatus(selectedApplication.id, status)}
          onDelete={() => deleteApplication(selectedApplication)}
        />
      )}
    </section>
  );
}

function AdminLoginPanel({
  email,
  password,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: {
  email: string;
  password: string;
  loading: boolean;
  error: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div className="section-panel mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] lg:grid-cols-[.9fr_1.1fr]">
      <div className="rounded-t-[2rem] bg-[linear-gradient(135deg,rgba(251,191,36,.14),rgba(124,58,237,.12),transparent)] p-8 md:rounded-l-[2rem] md:rounded-tr-none md:p-10">
        <ShieldCheck className="mb-6 text-violet-700" size={42} />
        <h3 className="text-4xl font-black text-slate-950">Admin login.</h3>
        <p className="mt-4 leading-8 text-slate-600">Sign in with the Gambox admin account to review applications.</p>
      </div>

      <form onSubmit={onSubmit} className="p-8 md:p-10">
        <label className="mb-2 block text-sm font-bold text-slate-600">Email</label>
        <input type="email" value={email} autoComplete="email" onChange={(event) => onEmailChange(event.target.value)} className="form-field mb-4" />

        <label className="mb-2 block text-sm font-bold text-slate-600">Password</label>
        <input type="password" value={password} autoComplete="current-password" onChange={(event) => onPasswordChange(event.target.value)} className="form-field mb-5" />

        {error && <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <button type="submit" disabled={loading} className="w-full rounded-full border border-amber-500/35 bg-amber-300/70 px-5 py-4 font-black text-slate-950 shadow-lg shadow-amber-400/20 backdrop-blur-xl transition hover:bg-amber-300/85 disabled:opacity-60">
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="section-panel p-5">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className={`mt-3 text-4xl font-black ${tone}`}>{value}</p>
    </div>
  );
}

function QuickStatusButton({
  status,
  currentStatus,
  disabled,
  onClick,
}: {
  status: "accepted" | "declined";
  currentStatus: JobApplicationStatus;
  disabled: boolean;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  const Icon = status === "accepted" ? CheckCircle2 : XCircle;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || currentStatus === status}
      className="inline-flex items-center justify-center rounded-full border border-violet-200/45 bg-white/55 p-3 text-slate-700 hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-40"
      aria-label={`Mark ${status}`}
    >
      <Icon size={16} />
    </button>
  );
}

function ApplicationDetailsModal({
  application,
  updating,
  deleting,
  onClose,
  onUpdateStatus,
  onDelete,
}: {
  application: JobApplication;
  updating: boolean;
  deleting: boolean;
  onClose: () => void;
  onUpdateStatus: (status: JobApplicationStatus) => void;
  onDelete: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="section-panel max-h-[90vh] w-full max-w-5xl overflow-y-auto p-0 shadow-2xl shadow-violet-950/25">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-violet-200/35 bg-white/80 p-5 backdrop-blur-xl">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <StatusBadge status={application.status} />
              <span className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{formatDate(application.createdAt)}</span>
            </div>
            <h3 className="text-3xl font-black text-slate-950 md:text-4xl">{application.name}</h3>
            <p className="mt-2 font-bold text-violet-700">{application.role}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-violet-200/45 bg-white/60 text-slate-700 hover:bg-white"
            aria-label="Close application details"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[1fr_18rem]">
          <div className="grid gap-5">
            <DetailBlock title="Why should Gambox remember this applicant?" value={application.reason} />
            <DetailBlock title="Experience" value={application.experience} />

            <div className="grid gap-4 md:grid-cols-2">
              <DetailLine icon={<Mail size={17} />} label="Account email" value={application.applicantEmail || "No account email"} />
              <DetailLine icon={<Mail size={17} />} label="Contact" value={application.contact || "Not provided"} />
              <DetailLine icon={<UserRound size={17} />} label="Roblox" value={application.robloxUsername || "Not provided"} />
              <DetailLine icon={<BriefcaseBusiness size={17} />} label="Reviewed by" value={application.reviewedBy || "Not reviewed"} />
            </div>

            {application.portfolioUrl && (
              <a
                href={application.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-200/45 bg-white/55 px-5 py-3 text-sm font-black text-violet-700 shadow-lg shadow-violet-950/5 backdrop-blur-xl hover:bg-white/80"
              >
                Open work link <ExternalLink size={16} />
              </a>
            )}
          </div>

          <aside className="h-fit rounded-[1.5rem] border border-violet-200/45 bg-white/45 p-4 backdrop-blur-xl">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-violet-700">Review status</p>
            <div className="grid gap-2">
              {(["accepted", "declined", "pending"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => onUpdateStatus(status)}
                  disabled={updating || application.status === status}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-violet-200/45 bg-white/60 px-4 py-3 text-sm font-black capitalize text-slate-950 shadow-lg shadow-violet-950/5 transition hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updating ? "Updating..." : status}
                </button>
              ))}
              {application.status === "declined" && (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={deleting}
                  className="mt-3 inline-flex items-center justify-center gap-2 rounded-full border border-red-200/70 bg-red-50/80 px-4 py-3 text-sm font-black text-red-700 shadow-lg shadow-red-950/5 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 size={16} /> {deleting ? "Deleting..." : "Delete Application"}
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: JobApplicationStatus }) {
  const Icon = status === "accepted" ? CheckCircle2 : status === "declined" ? XCircle : Clock3;
  const className = status === "accepted" ? "text-emerald-700 bg-emerald-50/70 border-emerald-200/70" : status === "declined" ? "text-amber-700 bg-amber-50/70 border-amber-200/70" : "text-violet-700 bg-violet-50/70 border-violet-200/70";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.18em] ${className}`}>
      <Icon size={14} /> {status}
    </span>
  );
}

function DetailBlock({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-violet-200/45 bg-white/45 p-5 backdrop-blur-xl">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-700">{title}</p>
      <p className="mt-3 whitespace-pre-wrap leading-8 text-slate-700">{value || "Not provided"}</p>
    </div>
  );
}

function DetailLine({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-violet-200/45 bg-white/40 p-4 backdrop-blur-xl">
      <div className="mb-2 flex items-center gap-2 text-violet-700">
        {icon}
        <p className="text-xs font-black uppercase tracking-[0.18em]">{label}</p>
      </div>
      <p className="break-words text-sm font-bold leading-6 text-slate-700">{value}</p>
    </div>
  );
}

function formatDate(timestamp?: { seconds: number } | null) {
  if (!timestamp) return "New application";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(timestamp.seconds * 1000));
}
