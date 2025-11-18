"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MessageSquare, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";
import type {
  DiscussionReplyDTO,
  DiscussionThreadDetailDTO,
} from "@/types/discussion";
import { studentAuth, type StudentSession } from "@/lib/student-auth";

const formatFullDate = (value: string) =>
  new Date(value).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });

interface Props {
  thread: DiscussionThreadDetailDTO;
}

export function DiscussionRepliesClient({ thread }: Props) {
  const [replies, setReplies] = useState<DiscussionReplyDTO[]>(thread.replies);
  const [replyCount, setReplyCount] = useState(thread.replyCount);
  const [studentSession, setStudentSession] = useState<StudentSession | null>(null);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { data: session } = useSession();

  const isAdmin = session?.user?.userType === "admin";

  useEffect(() => {
    const data = studentAuth.getSession();
    setStudentSession(data);
  }, []);

  const sortedReplies = useMemo(
    () =>
      [...replies].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    [replies],
  );

  const canReply = isAdmin || Boolean(studentSession);
  const displayName = isAdmin
    ? session?.user?.name ?? "Admin"
    : studentSession?.fullName ?? "";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canReply) {
      setMessage({ type: "error", text: "Silakan masuk terlebih dahulu." });
      return;
    }

    if (!content.trim()) {
      setMessage({ type: "error", text: "Isi balasan harus diisi." });
      return;
    }

    setSubmitting(true);
    setMessage(null);
    try {
      const requestPayload: Record<string, unknown> = {
        threadId: thread.id,
        content,
      };

      if (isAdmin) {
        requestPayload.actorType = "admin";
      } else if (studentSession) {
        requestPayload.studentId = studentSession.id;
        requestPayload.studentNumber = studentSession.studentId;
      }

      const res = await fetch("/api/discussion/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });

      const responsePayload = await res.json();
      if (!res.ok || !responsePayload?.success) {
        throw new Error(responsePayload?.error || "Gagal mengirim balasan");
      }

      const newReply: DiscussionReplyDTO = responsePayload.data;
      setReplies((prev) => [...prev, newReply]);
      setReplyCount((prev) => prev + 1);
      setContent("");
      setMessage({ type: "success", text: "Balasan terkirim!" });
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Gagal mengirim balasan.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#06B6D4]" />
          Balasan Diskusi ({replyCount})
        </h2>
        {message && (
          <span
            className={`text-sm ${
              message.type === "success" ? "text-emerald-600" : "text-rose-500"
            }`}
          >
            {message.text}
          </span>
        )}
      </div>

      {sortedReplies.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Belum ada balasan. Jadilah orang pertama yang menanggapi diskusi ini.
        </p>
      ) : (
        <div className="space-y-4">
          {sortedReplies.map((reply) => (
            <div
              key={reply.id}
              className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/70"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {reply.authorName}
                </span>
                <span>{formatFullDate(reply.createdAt)}</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line">
                {reply.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {canReply ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 border-t border-slate-100 pt-6 dark:border-slate-800"
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Menjawab sebagai <span className="font-semibold">{displayName}</span>
            {isAdmin ? " (Admin GEMA)" : ""}
          </p>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1">
              Balasan
            </label>
            <textarea
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm shadow-sm focus:border-[#06B6D4] focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              rows={4}
              placeholder="Tulis pertanyaan atau insight kamu..."
              value={content}
              onChange={(event) => setContent(event.target.value)}
              disabled={submitting}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Tetap sopan dan sertakan detail kode/materi jika perlu ya ✨
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#06B6D4] to-[#10B981] px-5 py-2 text-sm font-semibold text-white shadow hover:shadow-lg disabled:opacity-70"
            >
              {submitting ? "Mengirim..." : "Kirim Balasan"}
            </button>
          </div>
        </form>
      ) : (
        <div className="border-t border-slate-100 pt-6 dark:border-slate-800 space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Masuk sebagai siswa atau admin untuk ikut berdiskusi.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/student/login?redirect=/tutorial/discussion/${thread.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-[#06B6D4] px-4 py-2 text-sm font-semibold text-[#06B6D4] hover:bg-[#06B6D4]/10"
            >
              <LogIn className="h-4 w-4" />
              Login Siswa
            </Link>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800/50"
            >
              <LogIn className="h-4 w-4" />
              Login Admin
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
