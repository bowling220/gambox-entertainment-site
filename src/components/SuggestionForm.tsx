import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { postSuggestion } from "../lib/suggestions";
import { SectionHeader } from "./SectionHeader";

export function SuggestionForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [request, setRequest] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!request.trim()) {
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
      await postSuggestion({ name, contact, request });
      setName("");
      setContact("");
      setRequest("");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="suggestions" className="px-5 py-24">
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          eyebrow="We need ideas"
          title="Tell us what you want added."
          text="Share pages, game ideas, features, fixes, or anything else Gambox should add. Name and contact are optional."
        />

        <form onSubmit={handleSubmit} className="section-panel mx-auto grid max-w-2xl gap-5 p-6 md:p-8">
          <label className="grid gap-2">
            <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-600">Name optional</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={80}
              placeholder="Your name"
              className="form-field"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-600">Email or Discord optional</span>
            <input
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              maxLength={120}
              placeholder="email@example.com or Discord username"
              className="form-field"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-black uppercase tracking-[0.2em] text-violet-700">What do you want added? required</span>
            <textarea
              value={request}
              onChange={(event) => setRequest(event.target.value)}
              required
              maxLength={1200}
              rows={6}
              placeholder="Write the feature, page, game idea, or update you want added."
              className="form-field resize-y"
            />
          </label>

          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-500/35 bg-amber-300/70 px-7 py-4 font-black text-slate-950 shadow-lg shadow-amber-400/20 backdrop-blur-xl transition hover:bg-amber-300/85 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? "Sending..." : "Send suggestion"}
            <Send size={18} />
          </button>

          {status === "sent" && <p className="text-sm font-bold text-violet-700">Suggestion sent. Thanks for sharing it.</p>}
          {status === "error" && (
            <p className="text-sm font-bold text-amber-700">
              Please write what you want added. If the form will not send, try again later.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

