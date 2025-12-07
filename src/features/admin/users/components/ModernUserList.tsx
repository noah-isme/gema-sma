"use client";

import { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Mail, Calendar, Shield } from 'lucide-react';
import type { AdminUser, RoleOption } from '../types';

interface ModernUserListProps {
  users: AdminUser[];
  isLoading: boolean;
  onEdit: (user: AdminUser) => void;
  onDelete: (id: string) => void;
  options: RoleOption[];
}

export function ModernUserList({ users, isLoading, onEdit, onDelete, options }: ModernUserListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  const getRoleOption = (role: string) => {
    return options.find(opt => opt.value === role) || options[0];
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="flex gap-2">
                <div className="w-20 h-9 bg-gray-200 rounded"></div>
                <div className="w-20 h-9 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search admin by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter by Role */}
          <div className="flex items-center gap-2 min-w-[200px]">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Roles</option>
              {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">ADMIN LIST</h2>
          <p className="text-sm text-gray-500 mt-1">
            {filteredUsers.length} {filteredUsers.length === 1 ? 'admin' : 'admins'} found
          </p>
        </div>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && !isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || filterRole !== 'all' ? 'No admins found' : 'Belum ada admin'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || filterRole !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Tambahkan admin baru untuk mulai mengelola sistem.'
            }
          </p>
          {!searchTerm && filterRole === 'all' && (
            <button
              onClick={() => {/* Will be handled by parent */}}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Admin
            </button>
          )}
        </div>
      )}

      {/* Admin Cards */}
      <div className="space-y-4">
        {filteredUsers.map(user => {
          const roleOption = getRoleOption(user.role);
          
          return (
            <div
              key={user.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between gap-4">
                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {user.name}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleOption.badgeClass}`}>
                      {roleOption.label}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Dibuat: {formatDate(user.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-start gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => onEdit(user)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Menghapus admin tidak dapat dibatalkan. Yakin ingin melanjutkan?')) {
                        onDelete(user.id);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus
                  </button>
                </div>
              </div>

              {/* Mobile Actions - Always Visible on Small Screens */}
              <div className="flex md:hidden items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => onEdit(user)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm('Menghapus admin tidak dapat dibatalkan. Yakin ingin melanjutkan?')) {
                      onDelete(user.id);
                    }
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
