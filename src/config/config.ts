import { Dialect } from 'sequelize';

interface Config {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: Dialect;
    port: number;
}

export const development: Config = {
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'payroll',
    host: process.env.DATABASE_HOST || '0.0.0.0',
    port: 5432,
    dialect: 'postgres'
};