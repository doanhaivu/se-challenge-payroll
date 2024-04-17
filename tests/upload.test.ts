import request from 'supertest';
import { app } from '../src/app';
import { setupDatabase, teardownDatabase } from './testSetup';
import path from 'path';
import { readFileSync } from 'fs';
import { fi } from 'date-fns/locale';

const filePath = path.join(__dirname, '../time-report-42.csv');

describe.only('CSV Upload', () => {
  beforeAll(async () => {
    await setupDatabase();
  });

  afterAll(async () => {
    await teardownDatabase();
  });

  it('should upload CSV file successfully', async () => {
    const response = await request(app)
      .post('/api/upload')
      .attach('file', filePath)
      .expect(201);
    expect(response.body.message).toEqual('File uploaded and processed successfully.');
  });

  it('should prevent duplicate CSV uploads', async () => {
    await request(app)
      .post('/upload')
      .attach('file', filePath)
      .expect(201); // First upload should succeed

    const response = await request(app)
      .post('/upload')
      .attach('file', filePath)
      .expect(400); // Second upload should fail

    expect(response.body.message).toContain('not allowed');
  });
});
