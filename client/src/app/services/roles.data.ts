export const ROLES = [
  { id: 1, name: 'Super Admin', color: '#7c3aed', description: 'Full system access' , permissions: [
        { name: 'Dashboard Access', read: true, write: true, delete: true },
        { name: 'User Management', read: true, write: true, delete: true },
        { name: 'Content Editing', read: true, write: true, delete: true },
        { name: 'System Settings', read: true, write: true, delete: false }
      ]},
  { id: 2, name: 'Manager', color: '#2563eb', description: 'Content and user management',  permissions: [
        { name: 'Dashboard Access', read: true, write: true, delete: true },
        { name: 'User Management', read: true, write: true, delete: true },
        { name: 'Content Editing', read: true, write: true, delete: true },
        { name: 'System Settings', read: true, write: true, delete: false }
      ] },
  { id: 3, name: 'Contributor', color: '#059669', description: 'Create and edit content',  permissions: [
        { name: 'Dashboard Access', read: true, write: true, delete: true },
        { name: 'User Management', read: true, write: true, delete: true },
        { name: 'Content Editing', read: true, write: true, delete: true },
        { name: 'System Settings', read: true, write: true, delete: false }
      ] },
  { id: 4, name: 'Viewer', color: '#64748b', description: 'Read-only access' ,  permissions: [
        { name: 'Dashboard Access', read: true, write: true, delete: true },
        { name: 'User Management', read: true, write: true, delete: true },
        { name: 'Content Editing', read: true, write: true, delete: true },
        { name: 'System Settings', read: true, write: true, delete: false }
      ]}
];