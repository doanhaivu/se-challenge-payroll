import { Sequelize } from 'sequelize';
import { development } from '../config/config';
import employeeFactory from './employee';
import timeReportFactory from './timeReport';
import hoursWorkedFactory from './hoursWorked';

console.log(JSON.stringify(development));

export const sequelize = new Sequelize({
    dialect: 'postgres',
    host: development.host,
    username: development.username,
    password: development.password,
    database: development.database,
    port: development.port,
    logging: false,
});

const db = {
    sequelize,
    Sequelize,
    Employees: employeeFactory(sequelize),
    TimeReports: timeReportFactory(sequelize),
    HoursWorked: hoursWorkedFactory(sequelize)
};

db.TimeReports.hasMany(db.HoursWorked, { foreignKey: 'timeReportId', as: 'hoursEntries' });
db.Employees.hasMany(db.HoursWorked, { foreignKey: 'employeeId', as: 'hoursEntries' });
db.HoursWorked.belongsTo(db.Employees, { as: 'employee', foreignKey: 'employeeId' });

export default db;
