"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AdminLayout from '@/components/admin/AdminLayout';
import { MessageSquare, Plus, Edit, Trash2 } from 'lucide-react';


interface Thread {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  content?: string | null;
  createdAt: string;
  updatedAt: string;
  replyCount: number;
  lastReplyBy?: string | null;
  lastReplyAt?: string | null;
  lastReplyPreview?: string | null;
}

export default function AdminDiskusiPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingThread, setEditingThread] = useState<Thread | null>(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const adminName = session?.user?.name ?? "Admin GEMA";

  // Fetch threads from API
  const fetchThreads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/discussion/threads?limit=100", {
        cache: "no-store",
      });
      const payload = await res.json();
      if (!res.ok || !payload?.success) {
        throw new Error(payload?.error || "Gagal memuat thread");
      }
      setThreads(payload.data ?? []);
    } catch (error) {
      console.error(error);
      setThreads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  const openAdd = () => {
    setEditingThread(null);
    setForm({
      title: "",
      content: "",
    });
    setShowModal(true);
  };
  const openEdit = (thread: Thread) => {
    setEditingThread(thread);
    setForm({ title: thread.title, content: thread.content || "" });
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditingThread(null);
    setForm({
      title: "",
      content: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      return;
    }

    try {
      const endpoint = editingThread
        ? `/api/discussion/threads/${editingThread.id}`
        : "/api/discussion/threads";
      const method = editingThread ? "PUT" : "POST";
      const body = {
        title: form.title,
        content: form.content,
      };

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await res.json();
      if (!res.ok || !payload?.success) {
        throw new Error(payload?.error || "Gagal menyimpan thread");
      }

      closeModal();
      fetchThreads();
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan thread. Coba lagi.");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Hapus thread ini?")) {
      try {
        const res = await fetch(`/api/discussion/threads/${id}`, {
          method: "DELETE",
        });
        const payload = await res.json();
        if (!res.ok || !payload?.success) {
          throw new Error(payload?.error || "Gagal menghapus thread");
        }
        fetchThreads();
      } catch (error) {
        console.error(error);
        alert("Gagal menghapus thread.");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-6 py-4 flex items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Manajemen Diskusi Tutorial</h1>
                <p className="text-sm text-gray-600">Kelola thread diskusi, tanya jawab, dan forum tutorial.</p>
              </div>
            </div>
            <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4" /> Thread Baru
            </button>
          </div>
        </div>
        <div className="container mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul Thread</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Penanya</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Balasan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {threads.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-gray-400">Belum ada thread diskusi.</td></tr>
                ) : threads.map(thread => (
                  <tr key={thread.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{thread.title}</p>
                      {thread.lastReplyPreview && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {thread.lastReplyPreview}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <p className="font-medium">{thread.authorName}</p>
                      {thread.lastReplyBy && (
                        <p className="text-xs text-gray-500">
                          Terakhir oleh {thread.lastReplyBy}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-blue-700 font-bold">{thread.replyCount}</td>
                    <td className="px-6 py-4 text-gray-500">
                      <p>{thread.createdAt?.slice(0,10)}</p>
                      {thread.lastReplyAt && (
                        <p className="text-xs text-gray-400">
                          Update {thread.lastReplyAt.slice(0,10)}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEdit(thread)} className="text-blue-600 hover:text-blue-900 p-1" title="Edit"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(thread.id)} className="text-red-600 hover:text-red-900 p-1 ml-2" title="Hapus"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Add/Edit Thread */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">{editingThread ? 'Edit Thread' : 'Thread Baru'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul Thread</label>
                  <input type="text" className="w-full px-3 py-2 border rounded" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                </div>
                <p className="text-sm text-gray-500">
                  Thread akan diposting sebagai <span className="font-semibold text-gray-700">{adminName}</span>
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Isi Thread</label>
                  <textarea className="w-full px-3 py-2 border rounded" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={3} required />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" onClick={closeModal} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">Batal</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{editingThread ? 'Simpan' : 'Tambah'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
