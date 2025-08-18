export default () => ({
  node_env: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  dbUri:
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    (() => {
      throw new Error('MONGO_URI not set');
    })(),
  jwt: {
    secret:
      process.env.JWT_SECRET ||
      (() => {
        throw new Error('JWT_SECRET not set');
      })(),
    expiresIn: process.env.JWT_EXPIRES_IN ?? '24h',
  },
});
