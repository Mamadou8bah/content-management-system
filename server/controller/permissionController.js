const { getPermissions } = require('../service/permissionService');

const getPermissionsHandler = async (req, res) => {
  try {
    const permissions = await getPermissions();
    res.status(200).json(permissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getPermissionsHandler
};
