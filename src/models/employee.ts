import { Sequelize, DataTypes, ModelStatic, Model } from 'sequelize';

export default function (sequelize: Sequelize): ModelStatic<EmployeeInstance> {
    return sequelize.define<EmployeeInstance>('Employee', {
        employeeId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        jobGroup: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false,
        tableName: 'Employees'  // Explicitly defining the table name for clarity
    });
}

export interface EmployeeInstance extends Model {
    employeeId: string;
    jobGroup: string;
}