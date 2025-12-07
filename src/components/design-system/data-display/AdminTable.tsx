"use client";

import { ArrowUpDown } from 'lucide-react';
import { ReactNode } from 'react';

interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onSort?: (key: string) => void;
  sortKey?: string;
  sortOrder?: 'asc' | 'desc';
  loading?: boolean;
  emptyMessage?: string;
  zebra?: boolean;
}

export default function AdminTable<T = Record<string, unknown>>({
  data,
  columns,
  onSort,
  sortKey,
  loading = false,
  emptyMessage = 'No data available',
  zebra = true
}: AdminTableProps<T>) {
  
  const handleSort = (key: string, sortable?: boolean) => {
    if (sortable && onSort) {
      onSort(key);
    }
  };

  const getAlignment = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center': return 'text-center';
      case 'right': return 'text-right';
      default: return 'text-left';
    }
  };

  if (loading) {
    return (
      <div className="w-full overflow-hidden rounded-lg border border-gray-200">
        <div className="animate-pulse">
          <div className="bg-gray-50 h-12 border-b border-gray-200"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 border-b border-gray-200 bg-white"></div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full rounded-lg border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  className={`
                    px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider
                    ${getAlignment(column.align)}
                    ${column.sortable ? 'cursor-pointer hover:bg-gray-100 select-none' : ''}
                  `}
                  onClick={() => handleSort(column.key as string, column.sortable)}
                >
                  <div className={`flex items-center gap-2 ${
                    column.align === 'center' ? 'justify-center' :
                    column.align === 'right' ? 'justify-end' :
                    'justify-start'
                  }`}>
                    {column.label}
                    {column.sortable && (
                      <ArrowUpDown className={`w-3 h-3 ${
                        sortKey === column.key 
                          ? 'text-blue-600' 
                          : 'text-gray-400'
                      }`} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIdx) => (
              <tr
                key={rowIdx}
                className={`
                  border-b border-gray-100 last:border-0 transition-colors
                  hover:bg-gray-50
                  ${zebra && rowIdx % 2 === 1 ? 'bg-gray-25' : 'bg-white'}
                `}
              >
                {columns.map((column, colIdx) => (
                  <td
                    key={colIdx}
                    className={`px-6 py-4 text-sm text-gray-900 ${getAlignment(column.align)}`}
                  >
                    {column.render 
                      ? column.render(item)
                      : String((item as Record<string, unknown>)[column.key as string] ?? '-')
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
