import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-roles-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles-page.html',
  styleUrl: './roles-page.css',
})
export class RolesPage {
  // UI State
  showModal = false;
  newRoleName = '';

  // 1. All available permissions from your DB
  allPermissions = [
    { _id: { "$oid": "69401e440cebd6a674934fd8" }, key: "create_article" },
    { _id: { "$oid": "69401e440cebd6a674934fdd" }, key: "edit_article" },
    { _id: { "$oid": "69401e440cebd6a674934fe0" }, key: "delete_article" },
    { _id: { "$oid": "69401e440cebd6a674934fe3" }, key: "publish_article" },
    { _id: { "$oid": "69401e440cebd6a674934fe6" }, key: "view_article" },
    { _id: { "$oid": "69401e440cebd6a674934fe9" }, key: "manage_roles" },
    { _id: { "$oid": "69401e440cebd6a674934fec" }, key: "manage_permissions" }
  ];

  // 2. Mapping logic for the Table UI (Columns: Read, Write, Delete)
  modules = [
    { name: 'Articles', read: 'view_article', write: 'create_article', delete: 'delete_article' },
    { name: 'Roles', read: 'manage_roles', write: 'manage_roles', delete: 'manage_roles' },
    { name: 'Permissions', read: 'manage_permissions', write: 'manage_permissions', delete: 'manage_permissions' }
  ];

  // 3. Roles list from your DB
  roles = [
    {
      _id: { "$oid": "69401e440cebd6a674934ff0" },
      name: "SuperAdmin",
      permissions: [
        { "$oid": "69401e440cebd6a674934fd8" },
        { "$oid": "69401e440cebd6a674934fe0" },
        { "$oid": "69401e440cebd6a674934fdd" },
        { "$oid": "69401e440cebd6a674934fec" },
        { "$oid": "69401e440cebd6a674934fe9" },
        { "$oid": "69401e440cebd6a674934fe3" },
        { "$oid": "69401e440cebd6a674934fe6" }
      ]
    },
    {
      _id: { "$oid": "69401e440cebd6a674934ff4" },
      name: "Manager",
      permissions: [
        { "$oid": "69401e440cebd6a674934fd8" },
        { "$oid": "69401e440cebd6a674934fdd" },
        { "$oid": "69401e440cebd6a674934fe3" },
        { "$oid": "69401e440cebd6a674934fe6" }
      ]
    }
    ,
{
  "_id": {
    "$oid": "69401e440cebd6a674934ff8"
  },
  "name": "Contributor",
  "permissions": [
    {
      "$oid": "69401e440cebd6a674934fd8"
    },
    {
      "$oid": "69401e440cebd6a674934fdd"
    },
    {
      "$oid": "69401e440cebd6a674934fe6"
    }
  ],
  "isSystemRole": true,
  "createdAt": {
    "$date": "2025-12-15T14:42:12.644Z"
  },
  "updatedAt": {
    "$date": "2025-12-15T14:42:12.644Z"
  },
  "__v": 0
},
{
  "_id": {
    "$oid": "69401e440cebd6a674934ffc"
  },
  "name": "Viewer",
  "permissions": [
    {
      "$oid": "69401e440cebd6a674934fe6"
    }
  ],
  "isSystemRole": true,
  "createdAt": {
    "$date": "2025-12-15T14:42:12.650Z"
  },
  "updatedAt": {
    "$date": "2025-12-15T14:42:12.650Z"
  },
  "__v": 0
}
  ];

  selectedRole = this.roles[0];
  newRolePermissions: any[] = []; // Temporary array for modal state

  // --- METHODS ---

  selectRole(role: any) {
    this.selectedRole = role;
  }

  // Check if a specific role contains a permission key
  checkPermission(role: any, key: string): boolean {
    const perm = this.allPermissions.find(p => p.key === key);
    if (!perm || !role.permissions) return false;
    return role.permissions.some((p: any) => p.$oid === perm._id.$oid);
  }

  // Toggle permission OID in a role's permission array
  togglePermission(role: any, key: string) {
    const perm = this.allPermissions.find(p => p.key === key);
    if (!perm) return;

    if (!role.permissions) role.permissions = [];

    const index = role.permissions.findIndex((p: any) => p.$oid === perm._id.$oid);
    if (index > -1) {
      role.permissions.splice(index, 1);
    } else {
      role.permissions.push({ "$oid": perm._id.$oid });
    }
  }

  // Modal Handlers
  openModal() {
    this.newRoleName = '';
    this.newRolePermissions = []; 
    this.showModal = true;
  }

  createRole() {
    if (!this.newRoleName.trim()) {
      alert("Please enter a role name.");
      return;
    }

    const newEntry = {
      _id: { "$oid": Math.random().toString(36).substring(2, 15) }, // Temporary ID
      name: this.newRoleName,
      permissions: [...this.newRolePermissions] // Uses OIDs collected via toggle
    };

    this.roles.push(newEntry);
    this.selectedRole = newEntry;
    this.showModal = false;
  }

  deleteRole(id: string) {
    if(confirm('Are you sure you want to delete this role?')) {
      this.roles = this.roles.filter(r => r._id.$oid !== id);
      if (this.selectedRole._id.$oid === id && this.roles.length > 0) {
        this.selectedRole = this.roles[0];
      }
    }
  }

  // Final Save Action
  saveChanges() {
    const payload = {
      id: this.selectedRole._id.$oid,
      permissions: this.selectedRole.permissions
    };

    console.log('Saving to DB:', payload);
    
    // Here you would call your API service:
    // this.apiService.updateRole(payload).subscribe(...)
    
    alert(`Changes saved for ${this.selectedRole.name}!`);
  }
}