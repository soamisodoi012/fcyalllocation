const { Role, Permission } = require('../model/associations');

const setupRolesAndPermissions = async () => {
    try {
        // Create permissions
        const createCurrency = await Permission.create({ permissionName: 'createCurrency' });
        const readCurrency = await Permission.create({ permissionName: 'readCurrency' });
        const readAllCurrency = await Permission.create({ permissionName: 'readAllCurrency' });
        ////
        const createBranch = await Permission.create({ permissionName: 'createBranch' });
        const readBranch = await Permission.create({ permissionName: 'readBranch' });
        const readAllBranch = await Permission.create({ permissionName: 'readAllBranch' });
        ///
        const readAllUser = await Permission.create({ permissionName: 'readAllUser' });
        const createUser = await Permission.create({ permissionName: 'createUser' });
        const resetUser = await Permission.create({ permissionName: 'resetUser' });
        const resetUserPassword = await Permission.create({ permissionName: 'resetUserPassword' });
        const readProfie = await Permission.create({ permissionName: 'readProfie' });
        const requestPasswordReset = await Permission.create({ permissionName: 'requestPasswordReset' });
        const createRole = await Permission.create({ permissionName: 'createRole' });
        const readAllRole = await Permission.create({ permissionName: 'readAllRole' });
/////////////////////
const approveFcyById = await Permission.create({ permissionName: 'approveFcyById' });
const readLiveFcyById = await Permission.create({ permissionName: 'readLiveFcyById' });
const authorizeINU = await Permission.create({ permissionName: 'authorizeINU' });
const rejectINUById = await Permission.create({ permissionName: 'rejectINUById' });
const readAllLiveFcy = await Permission.create({ permissionName: 'readAllLiveFcy' });
const createINUFcy = await Permission.create({ permissionName: 'createINUFcy' });
const deleteINUFcy = await Permission.create({ permissionName: 'deleteINUFcy' });
const readAllINUFcy = await Permission.create({ permissionName: 'readAllINUFcy' });
const readINUFcyById = await Permission.create({ permissionName: 'readINUFcyById' });
const editINUFcy = await Permission.create({ permissionName: 'editINUFcy' });
const makeWaitingForAuthorization = await Permission.create({ permissionName: 'makeWaitingForAuthorization' });
/////////////////////////////
const countAuthorizedFcy = await Permission.create({ permissionName: 'countAuthorizedFcy' });
const countAllPending = await Permission.create({ permissionName: 'countAllPending' });
const countAllRejected = await Permission.create({ permissionName: 'countAllRejected' });
const countAllApproved = await Permission.create({ permissionName: 'countAllApproved' });
const countWaitingForAuthorized = await Permission.create({ permissionName: 'countWaitingForAuthorization' });
        // Create roles
        const adminRole = await Role.create({ roleName: 'admin' });
        const imputterRole = await Role.create({ roleName: 'imputter' });
        // Associate permissions with roles
        await adminRole.addPermissions([createINUFcy,authorizeINU]); // Admin role gets all permissions
        await imputterRole.addPermissions([createINUFcy,authorizeINU]); // Imputter role gets only read permission

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
        data: role,
      });
    } catch (error) {
      console.error('Error creating role:', error);
      res.status(500).json({ error: 'An error occurred while creating the role' });
    }
  };
  const getAllRole = async (req, res) => {
    try {
      const roles = await Role.findAll({
        attributes: ['roleName'],  // Select only the roleName
        include: [{
          model: Permission,  // Assuming Permission is the associated model
          attributes: ['permissionName'],  // Only include the permissionName field
          through: { attributes: [] }  // Omit the junction table attributes
        }]
      });
  
      // Format the response to include permissions as an array of strings
      const formattedRoles = roles.map(role => {
        return {
          roleName: role.roleName,
          Permissions: role.Permissions.map(permission => permission.permissionName)  // Extract permissionName into an array
        };
      });
  
      res.status(200).json(formattedRoles);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  const updateRole = async (req, res) => {
    try {
      const { permissions} = req.body; // Only expecting permissions as an array
      const role = await Role.findByPk(req.params.pk);
  
      if (!role) {
        return res.status(404).json({ message: 'Role not found' });
      }
  
      // Update permissions if provided
      if (permissions && Array.isArray(permissions)) {
        // Find the permissions based on the provided names
        const permissionInstances = await Permission.findAll({
          where: { permissionName: permissions },
        });
  
        if (permissionInstances.length === 0) {
          return res.status(400).json({ error: 'No valid permissions found' });
        }
  
        // Set the role's permissions (this will replace the existing permissions)
        await role.setPermissions(permissionInstances);
      }
      // Send the updated role details
      const updatedRole = await Role.findOne({
        where: { roleName: req.params.pk },
        include: [{
          model: Permission,
          attributes: ['permissionName'],
          through: { attributes: [] },
        }],
      });
  
      const formattedRole = {
        roleName: updatedRole.roleName,
        Permissions: updatedRole.Permissions.map(permission => permission.permissionName),
      };
  
      res.status(200).json({
        message: 'successful',
        data: formattedRole,
      });
    } catch (error) {
      console.error('Error updating role:', error);
      res.status(500).json({ error: 'An error occurred while updating the role' });
    }
  };
  const getAllPermissions = async (req, res) => {
    try {
    const allPermissions = await Permission.findAll();
    return res.status(200).json({allPermissions});}
    catch (err) {
      return res.status(500).json({err:'error while getting permissions'});
    }
  };
module.exports = {
    updateRole,
    setupRolesAndPermissions,
    createRole,
    getAllPermissions,
    getAllRole,
};
