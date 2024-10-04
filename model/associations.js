//const Role = require('./role');
const Permission = require('./permission');
const RolePermission = require('./rolePermission');
const User = require('./user');
const Role = require('./role');
// Define associations
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'roleId' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permissionId' });
User.belongsToMany(Role, { through: 'UserRole', foreignKey: 'username', otherKey: 'roleName' });
Role.belongsToMany(User, { through: 'UserRole', foreignKey: 'roleName', otherKey: 'username' });
module.exports = {
  Role,
  Permission,
  RolePermission,
  User,
};
