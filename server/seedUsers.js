
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./model/User');
const Role = require('./model/Role');

const users = [
  {
    fullname: 'Super Admin',
    email: 'superadmin@example.com',
    password: 'superadmin',
    role: 'SuperAdmin',
  },
  {
    fullname: 'Manager User',
    email: 'manager@example.com',
    password: 'manager',
    role: 'Manager',
  },
  {
    fullname: 'Contributor User',
    email: 'contributor@example.com',
    password: 'contributor',
    role: 'Contributor',
  },
  {
    fullname: 'Viewer User',
    email: 'viewer@example.com',
    password: 'viewer',
    role: 'Viewer',
  },
];

async function seedUsers() {
  for (const userData of users) {
    const existing = await User.findOne({ email: userData.email });
    if (existing) continue;
    const role = await Role.findOne({ name: userData.role });
    if (!role) {
      console.error(`Role not found: ${userData.role}`);
      continue;
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    await User.create({
      fullname: userData.fullname,
      email: userData.email,
      password: hashedPassword,
      roleId: role._id,
      isActive: true,
    });
    console.log(`Created user: ${userData.email}`);
  }
}

async function main() {
 await seedUsers();
  console.log('Seeding complete.');
}


main().catch(err => {
  console.error(err);
  process.exit(1);
});

module.exports = { main };
