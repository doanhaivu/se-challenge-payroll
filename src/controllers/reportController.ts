import { Request, Response } from 'express';
import db from '../models/index';
import { Op } from 'sequelize';
import { format } from 'date-fns';

export class ReportController {
    static getPayrollReport = async (req: Request, res: Response) => {
        try {
            const results = await db.HoursWorked.findAll({
                include: [{
                    model: db.Employees,
                    as: 'employee',
                    attributes: ['employeeId', 'jobGroup']
                }],
                attributes: ['date', 'hours', 'employeeId'],
                order: [
                    ['employeeId', 'ASC'],
                    ['date', 'ASC']
                ]
            });

            const payrollReport = results.reduce((acc: any, curr) => {
                const employee = curr.employee; 
                const payPeriod = getPayPeriod(curr.date);
                const key = `${employee?.employeeId}-${payPeriod.startDate}-${payPeriod.endDate}`;
                const hourlyRate = employee?.jobGroup === 'A' ? 20 : 30;
                const amountPaid = curr.hours * hourlyRate;

                if (!acc[key]) {
                    acc[key] = {
                        employeeId: employee?.employeeId,
                        payPeriod,
                        amountPaid: 0
                    };
                }

                acc[key].amountPaid += amountPaid;
                return acc;
            }, {});

            const employeeReports = Object.values(payrollReport).map((report: any) => ({
                ...(report as object),
                amountPaid: `$${(report.amountPaid as number).toFixed(2)}`
            }));

            res.status(200).json({ payrollReport: { employeeReports } });
        } catch (error: any) {
            res.status(500).send({ message: 'Failed to retrieve payroll report', error: error.message });
        }
    };
}

function getPayPeriod(dateStr: string) {
    const date = new Date(dateStr);
    const month = date.getMonth();
    const year = date.getFullYear();
    const midMonth = new Date(year, month, 16);

    if (date < midMonth) {
        return {
            startDate: format(new Date(year, month, 1), 'yyyy-MM-dd'),
            endDate: format(new Date(year, month, 15), 'yyyy-MM-dd')
        };
    } else {
        return {
            startDate: format(midMonth, 'yyyy-MM-dd'),
            endDate: format(new Date(year, month + 1, 0), 'yyyy-MM-dd') // Last day of the month
        };
    }
}
