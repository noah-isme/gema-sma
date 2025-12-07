"use client";

import { Mail, Calendar, Edit, Trash2 } from 'lucide-react';
import BadgeRole from './BadgeRole';

interface UserCardProps {
  name: string;
  email: string;
  role: 'admin' | 'super_admin' | 'moderator' | 'teacher' | 'student';
  createdAt: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function UserCard({
  name,
  email,
  role,
  createdAt,
  onEdit,
  onDelete
}: UserCardProps) {
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="rounded-xl border border-gray-200 p-6 bg-white hover:shadow-md hover:border-gray-300 transition-all duration-200 group">
      <div className="flex items-start justify-between gap-4">
        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {name}
            </h3>
            <BadgeRole role={role} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>Dibuat: {formatDate(createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Actions - Desktop (Hover) */}
        <div className="hidden md:flex items-start gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onEdit && (
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Hapus
            </button>
          )}
        </div>
      </div>

      {/* Actions - Mobile (Always Visible) */}
      {(onEdit || onDelete) && (
        <div className="flex md:hidden items-center gap-2 mt-4 pt-4 border-t border-gray-100">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Hapus
            </button>
          )}
        </div>
      )}
    </div>
  );
}
