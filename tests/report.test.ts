import request from 'supertest';
import { app } from '../src/app';
import { cleanUpTables, setupDatabase, teardownDatabase } from './testSetup';
import path from 'path';

const filePath = path.join(__dirname, '../time-report-43.csv');

describe('Payroll Report', () => {
    beforeAll(async () => {
        await setupDatabase();
    });

    beforeEach(async () => {
        await cleanUpTables();
    });

    afterAll(async () => {
        await teardownDatabase();
    });

    it('should retrieve a correct payroll report', async () => {
        const uploadResponse = await request(app)
        .post('/api/upload')
        .attach('file', filePath)
        .expect(201);
        expect(uploadResponse.body.message).toEqual('File uploaded and processed successfully.');

        const response = await request(app)
        .get('/api/reports/payroll')
        .expect(200);

        expect(response.body).toEqual({
            "payrollReport": {
                "employeeReports": [
                    {
                        "employeeId": "1",
                        "payPeriod": {
                            "startDate": "2023-01-01",
                            "endDate": "2023-01-15"
                        },
                        "amountPaid": "$300.00"
                    },
                    {
                        "employeeId": "1",
                        "payPeriod": {
                            "startDate": "2023-01-16",
                            "endDate": "2023-01-31"
                        },
                        "amountPaid": "$80.00"
                    },
                    {
                        "employeeId": "2",
                        "payPeriod": {
                            "startDate": "2023-01-16",
                            "endDate": "2023-01-31"
                        },
                        "amountPaid": "$90.00"
                    }
                ]
            }
        });
    });
});
