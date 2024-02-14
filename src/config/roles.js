const roles = {
  ROLE_ADMIN: 'ROLE_ADMIN',
  ROLE_USER: 'ROLE_USER',
};

const roleRights = {
  ROLE_ADMIN: ['ROLE_ADMIN', 'ROLE_USER'],
  ROLE_USER: ['ROLE_USER'],
};

const getRoleRights = (authType) => {
  return roleRights[authType];
};

module.exports = {
  roles,
  getRoleRights,
};
