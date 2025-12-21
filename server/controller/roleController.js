const { createRole, getRoles, getRoleById, updateRole, deleteRole, setRolePermissions } = require('../service/roleService');

const createRoleHandler = async (req, res) => {
    try {
        const { name, permissions, isSystemRole } = req.body;
        const role = await createRole(name, permissions, isSystemRole);
        res.status(201).json({
            message: 'Role created successfully',
            role
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getRolesHandler = async (req, res) => {
    try {
        const roles = await getRoles();
        res.status(200).json(roles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getRoleByIdHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await getRoleById(id);
        res.status(200).json(role);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

const updateRoleHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const role = await updateRole(id, updates);
        res.status(200).json({
            message: 'Role updated successfully',
            role
        });
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

const deleteRoleHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteRole(id);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const setRolePermissionsHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { permissionIds } = req.body;
        const role = await setRolePermissions(id, permissionIds);
        res.status(200).json({
            message: 'Role permissions updated successfully',
            role
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    createRoleHandler,
    getRolesHandler,
    getRoleByIdHandler,
    updateRoleHandler,
    deleteRoleHandler,
    setRolePermissionsHandler
};
