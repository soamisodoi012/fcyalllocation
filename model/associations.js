//const Role = require('./role');
const Permission = require('./permission');
const RolePermission = require('./rolePermission');
const User = require('./user');
const Role = require('./role');
const Category = require('./Category');
const Item = require('./ItemDetail');
// Define associations
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'roleId' });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'permissionId' });
User.belongsToMany(Role, { through: 'UserRole', foreignKey: 'username', otherKey: 'roleName' });
Role.belongsToMany(User, { through: 'UserRole', foreignKey: 'roleName', otherKey: 'username' });
Category.hasMany(Item, { foreignKey: 'categoryId' });
Item.belongsTo(Category, { foreignKey: 'categoryId' });
module.exports = {
  Role,
  Permission,
  RolePermission,
  User,
  Category,
  Item,
};
