export const authConstants = {
  secret: process.env.JWT_SECRET || 'secretKey',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'refreshSecretKey',
};
