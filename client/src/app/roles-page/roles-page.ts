import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Roles } from '../services/roles';

@Component({
  selector: 'app-roles-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles-page.html',
  styleUrl: './roles-page.css',
})
export class RolesPage {
  
  showModal = false;
  newRoleName = '';

  loading = true;
  constructor(private rolesService: Roles) {}


  allPermissions: any[] = [];
  
  modules = [
    { name: 'Articles', read: 'view_article', write: 'create_article', delete: 'delete_article' },
    { name: 'Roles', read: 'manage_roles', write: 'manage_roles', delete: 'manage_roles' },
    { name: 'Permissions', read: 'manage_permissions', write: 'manage_permissions', delete: 'manage_permissions' }
  ];
roles: any[] = [];
selectedRole: any = null;
newRolePermissions: any[] = [];

private getId(value: any): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    if (typeof value.$oid === 'string') return value.$oid;
    if (typeof value._id === 'string') return value._id;
    if (value._id && typeof value._id === 'object' && typeof value._id.$oid === 'string') return value._id.$oid;
    if (typeof value.id === 'string') return value.id;
  }
  return null;
}

isRoleSelected(role: any): boolean {
  const selectedId = this.getId(this.selectedRole?._id);
  const roleId = this.getId(role?._id);
  return !!selectedId && !!roleId && selectedId === roleId;
}

ngOnInit() {
  let rolesLoaded = false;
  let permissionsLoaded = false;
  this.rolesService.getRoles().subscribe({
    next: (roles: any[]) => {
      this.roles = roles || [];
      this.selectedRole = this.roles.length ? this.roles[0] : null;
      rolesLoaded = true;
      if (rolesLoaded && permissionsLoaded) this.loading = false;
    },
    error: () => {
      rolesLoaded = true;
      if (rolesLoaded && permissionsLoaded) this.loading = false;
    }
  });
  this.rolesService.getPermissions().subscribe({
    next: (permissions: any[]) => {
      this.allPermissions = permissions || [];
      permissionsLoaded = true;
      if (rolesLoaded && permissionsLoaded) this.loading = false;
    },
    error: () => {
      permissionsLoaded = true;
      if (rolesLoaded && permissionsLoaded) this.loading = false;
    }
  });
}

selectRole(role: any) {
  this.selectedRole = role;
}


 
  checkPermission(role: any, key: string): boolean {
    if (!role) return false;
    const perm = this.allPermissions.find((p: any) => p?.key === key);
    const permId = this.getId(perm?._id);
    if (!permId || !Array.isArray(role.permissions)) return false;
    return role.permissions.some((p: any) => this.getId(p) === permId);
  }

  
  togglePermission(role: any, key: string) {
    if (!role) return;
    const perm = this.allPermissions.find((p: any) => p?.key === key);
    const permId = this.getId(perm?._id);
    if (!permId) return;

    if (!Array.isArray(role.permissions)) role.permissions = [];

    const index = role.permissions.findIndex((p: any) => this.getId(p) === permId);
    if (index > -1) {
      role.permissions.splice(index, 1);
    } else {
      role.permissions.push(permId);
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

    const newRole = {
      name: this.newRoleName,
      permissions: this.newRolePermissions,
      isSystemRole: false
    };

    this.rolesService.createRole(newRole).subscribe({
      next: (res: any) => {
        this.roles.push(res.role);
        this.selectedRole = res.role;
        this.showModal = false;
        alert('Role created successfully');
      },
      error: (err) => {
        console.error(err);
        alert('Failed to create role: ' + (err.error?.error || err.message));
      }
    });
  }

  deleteRole(roleOrId: any) {
    if(confirm('Are you sure you want to delete this role?')) {
      const id = this.getId(roleOrId?._id ?? roleOrId);
      if (!id) return;

      this.rolesService.deleteRole(id).subscribe({
        next: () => {
          this.roles = this.roles.filter(r => this.getId(r?._id) !== id);
          if (this.selectedRole && this.getId(this.selectedRole?._id) === id) {
            this.selectedRole = this.roles.length > 0 ? this.roles[0] : null;
          }
        },
        error: (err) => {
          console.error(err);
          alert('Failed to delete role: ' + (err.error?.error || err.message));
        }
      });
    }
  }

 
  saveChanges() {
    if (!this.selectedRole) return;

    const roleId = this.getId(this.selectedRole?._id);
    if (!roleId) return;

    const permissionIds = this.selectedRole.permissions
      .map((p: any) => this.getId(p))
      .filter((id: string | null) => id !== null);

    this.rolesService.updatePermissions(roleId, permissionIds).subscribe({
      next: (res: any) => {
        const index = this.roles.findIndex(r => this.getId(r._id) === roleId);
        if (index !== -1) {
          this.roles[index] = res.role;
          this.selectedRole = res.role;
        }
        alert(`Changes saved for ${this.selectedRole.name}!`);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to save changes: ' + (err.error?.error || err.message));
      }
    });
  }
}