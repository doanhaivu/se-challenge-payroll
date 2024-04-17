import request from 'supertest';
import { app } from '../src/app';
import { setupDatabase, teardownDatabase } from './testSetup';

describe.skip('Payroll Report', () => {
    beforeEach(async () => {
        await setupDatabase();
    });
  
    afterEach(async () => {
        await teardownDatabase();
    });

    it('should retrieve a correct payroll report', async () => {
        const response = await request(app)
        .get('/reports/payroll')
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
