import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize';

export interface TimeReportAttributes {
    id: number;
}

export interface TimeReportInstance extends Model<TimeReportAttributes>, TimeReportAttributes {
    createdAt?: Date;
    updatedAt?: Date;
}

export default function(sequelize: Sequelize): ModelStatic<TimeReportInstance> {
    const TimeReport = sequelize.define<TimeReportInstance>('TimeReport', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        }
    }, {
        timestamps: true,
        tableName: 'TimeReports'
    });

    return TimeReport;
}
