import db from '../src/models';

export const setupDatabase = async () => {
  await db.sequelize.sync({ force: true });
};

export const cleanUpTables = async () => {
  await db.HoursWorked.truncate({ cascade: true });
  await db.Employees.truncate({ cascade: true });
  await db.TimeReports.truncate({ cascade: true });
};

export const teardownDatabase = async () => {
  await db.sequelize.close();
};
