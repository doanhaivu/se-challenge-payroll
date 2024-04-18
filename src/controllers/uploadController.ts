import { Request, Response } from 'express';
import multer from 'multer';
import { parse } from 'papaparse';
import moment from 'moment';
import db from '../models/index';

interface DataRow {
    date: string;
    hours: number;
    employeeId: string;
    jobGroup: string;
}

const upload = multer({ storage: multer.memoryStorage() });
const renameHeader = (header: string) => {
    const headersMap: { [key: string]: string } = {
        'date': 'date',
        'hours worked': 'hours',
        'employee id': 'employeeId',
        'job group': 'jobGroup'
    };
    return headersMap[header.trim().toLowerCase()] || header;
};
export class UploadController {
    static uploadCSV = [
        upload.single('file'),
        async (req: Request, res: Response) => {
            if (!req.file) {
                return res.status(400).send({ message: 'No file provided!' });
            }

            const content = req.file.buffer.toString();
            const parsed = parse<DataRow>(content, {
                header: true,
                dynamicTyping: {
                    'date': true,
                    'hours': true,
                    'employeeId': false,
                    'jobGroup': true
                },
                skipEmptyLines: true,
                transformHeader: renameHeader,
            });
            if (parsed.errors.length) {
                return res.status(400).send({ message: 'Error parsing CSV', errors: parsed.errors });
            }

            const data: DataRow[] = parsed.data;
            const timeReportId = parseInt(req.file.originalname.split('-')[2] ?? '0');

            let transaction;
            try {
                transaction = await db.sequelize.transaction();
                const [timeReport, timeReportCreated] = await db.TimeReports.findOrCreate({
                    where: { id: timeReportId },
                    transaction
                });

                if (!timeReportCreated) {
                    await transaction.rollback();
                    return res.status(400).send({ message: 'Time report ID already exists.' });
                }

                for (const row of data) {
                    const formattedDate = moment(row.date, 'DD/MM/YYYY').isValid() ? moment(row.date, 'DD/MM/YYYY').toDate() : null;
                    if (!formattedDate) {
                        console.error("Invalid date format:", row.date);
                        continue;
                    }

                    const [employee, created] = await db.Employees.findOrCreate({
                        where: { employeeId: row.employeeId },
                        defaults: { jobGroup: row.jobGroup },
                        transaction
                    });

                    await db.HoursWorked.create({
                        date: formattedDate.toISOString(),
                        hours: row.hours,
                        employeeId: row.employeeId,
                        timeReportId: timeReport.id,
                    }, { transaction });
                }

                await transaction.commit();
                res.status(201).send({ message: 'File uploaded and processed successfully.' });
            } catch (error: any) {
                console.log(`Error during processing, rolling back transaction`);
                if (transaction) await transaction.rollback();
                if (!res.headersSent) {
                    res.status(500).send({ message: 'Failed to process file', error: error.message });
                }
            }
        }
    ];
}
