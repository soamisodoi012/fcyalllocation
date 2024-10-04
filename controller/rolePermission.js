const { Role, Permission } = require('../model/associations');

const setupRolesAndPermissions = async () => {
    try {
        // Create permissions
        const create = await Permission.create({ permissionName: 'create' });
        const read = await Permission.create({ permissionName: 'read' });
        const update = await Permission.create({ permissionName: 'update' });
        const delet = await Permission.create({ permissionName: 'delete' });

        // Create roles
        const adminRole = await Role.create({ roleName: 'admin' });
        const imputterRole = await Role.create({ roleName: 'imputter' });
        // Associate permissions with roles
        await adminRole.addPermissions([create, read, update, delet]); // Admin role gets all permissions
        await imputterRole.addPermissions([read,create]); // Imputter role gets only read permission

        console.log('Roles and permissions set up successfully');
    } catch (error) {
        console.error('Error setting up roles and permissions:', error);
    }
};
const createRole = async (req, res) => {
    try {
      const { roleName, permissions } = req.body; // Expecting permissions as an array
  
      // Check for empty roleName or permissions
      if (!roleName || !Array.isArray(permissions) || permissions.length === 0) {
        return res.status(400).json({ error: 'Role name and permissions are required' });
      }
  
      // Find the permissions based on the provided names
      const permissionInstances = await Permission.findAll({
        where: { permissionName: permissions },
      });
  
      // Check if any permissions were found
      if (permissionInstances.length === 0) {
        return res.status(400).json({ error: 'No valid permissions found' });
      }
  
      // Create the role
      const role = await Role.create({ roleName });
  
      // Associate the permissions with the role
      await role.addPermissions(permissionInstances);
  
      res.status(201).json({
        message: 'Role created successfully',
        data: role,
      });
    } catch (error) {
      console.error('Error creating role:', error);
      res.status(500).json({ error: 'An error occurred while creating the role' });
    }
  };
module.exports = {
    setupRolesAndPermissions,
    createRole,
};
