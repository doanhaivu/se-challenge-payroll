import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';
import { EmployeeInstance } from './employee';

export interface HoursWorkedAttributes {
    id?: number;
    date: string;
    hours: number;
    employeeId: string;
    timeReportId: number;
}

export interface HoursWorkedInstance extends Model<HoursWorkedAttributes>, HoursWorkedAttributes {
    createdAt?: Date;
    updatedAt?: Date;
    employee?: EmployeeInstance;
}

export default function(sequelize: Sequelize): ModelStatic<HoursWorkedInstance> {
    const HoursWorked = sequelize.define<HoursWorkedInstance>('HoursWorked', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        hours: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        employeeId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'Employees',
                key: 'employeeId'
            }
        },
        timeReportId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'TimeReports',
                key: 'id',
            }
        }
    }, {
        timestamps: true,
        tableName: 'HoursWorked'
    });

    return HoursWorked;
}
