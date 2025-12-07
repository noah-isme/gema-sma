interface BadgeRoleProps {
  role: 'admin' | 'super_admin' | 'moderator' | 'teacher' | 'student';
  size?: 'sm' | 'md';
}

const roleConfig = {
  admin: {
    label: 'Admin',
    className: 'bg-blue-100 text-blue-700'
  },
  super_admin: {
    label: 'Super Admin',
    className: 'bg-orange-100 text-orange-700'
  },
  moderator: {
    label: 'Moderator',
    className: 'bg-purple-100 text-purple-700'
  },
  teacher: {
    label: 'Guru',
    className: 'bg-green-100 text-green-700'
  },
  student: {
    label: 'Siswa',
    className: 'bg-gray-100 text-gray-700'
  }
};

export default function BadgeRole({ role, size = 'md' }: BadgeRoleProps) {
  const config = roleConfig[role] || roleConfig.admin;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center ${sizeClass} rounded-full font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
