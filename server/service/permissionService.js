const Permission = require('../model/Permisson');

const getPermissions = async () => {
  return Permission.find().sort({ key: 1 });
};

module.exports = {
  getPermissions
};
