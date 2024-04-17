import db from '../src/models';

export const setupDatabase = async () => {
  await db.sequelize.sync({ force: true });
};

export const teardownDatabase = async () => {
  await db.sequelize.close();
};
