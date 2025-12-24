const Role=require('./model/Role');
const Permission=require('./model/Permisson')


const ROLE_PERMISSION_MAP = {
  SuperAdmin: [
    'create_article',
    'edit_article',
    'delete_article',
    'publish_article',
    'view_article',
    'manage_roles',
    'manage_permissions',
    'view_users',
    'change_user_role'
  ],

  Manager: [
    'create_article',
    'edit_article',
    'delete_article',
    'publish_article',
    'view_article',
    'view_users'
  ],

  Contributor: [
    'create_article',
    'edit_article',
    'view_article'
  ],

  Viewer: [
    'view_article'
  ]
};


async function seedRolesWithPermissions() {
  for (const roleName in ROLE_PERMISSION_MAP) {
    const permissionKeys = ROLE_PERMISSION_MAP[roleName];

   
    const permissions = await Permission.find({
      key: { $in: permissionKeys }
    });

    const permissionIds = permissions.map(p => p._id);

    const role = await Role.findOne({ name: roleName });

    if (!role) {
      await Role.create({
        name: roleName,
        isSystemRole: true,
        permissions: permissionIds
      });
    } else {
      role.permissions = permissionIds;
      await role.save();
    }
  }
}



async function seedPermissions() {
  const permissionKeys = new Set(
    Object.values(ROLE_PERMISSION_MAP).flat()
  );

  for (const key of permissionKeys) {
    const exists = await Permission.findOne({ key });
    if (!exists) {
      await Permission.create({ key });
    }
  }
}

async function startRolesSeeding() {
  await seedPermissions();
  await seedRolesWithPermissions();
}
module.exports = startRolesSeeding;
