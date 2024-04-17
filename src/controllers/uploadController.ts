import { Request, Response } from 'express';
import multer from 'multer';
import { parse } from 'papaparse';
import db from '../models/index';

const upload = multer({ storage: multer.memoryStorage() });

export class UploadController {
    static uploadCSV = [
        upload.single('file'),
        async (req: Request, res: Response) => {
            if (!req.file) {
                return res.status(400).send({ message: 'No file provided!' });
            }

            const content = req.file.buffer.toString();
            const parsed = parse(content, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true
            });

            if (parsed.errors.length) {
                return res.status(400).send({ message: 'Error parsing CSV', errors: parsed.errors });
            }

            const { data } = parsed;

            // Assuming data includes 'date', 'hours', 'employeeId', 'jobGroup'
            try {
                await db.sequelize.transaction(async (transaction) => {
                    for (const row of data) {
                        const employee = await db.Employees.findOrCreate({
                            where: { employeeId: (row as any).employeeId },
                            defaults: { jobGroup: (row as any).jobGroup },
                            transaction
                        });

                        await db.HoursWorked.create({
                            date: new Date((row as any).date).toISOString(),
                            hours: (row as any).hours,
                            employeeId: (row as any).employeeId,
                            timeReportId: parseInt(req.file?.originalname.split('-')[2] ?? '0'),
                        }, { transaction });
                    }
                });
                res.status(201).send({ message: 'File uploaded and processed successfully.' });
            } catch (error: any) {
                res.status(500).send({ message: 'Failed to process file', error: error.message });
            }
        }
    ];
}
