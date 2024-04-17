import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import apiRoutes from './routes/api';
import db from './models';

export const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api', apiRoutes);

if (process.env.NODE_ENV !== 'test') {
    // Synchronize the database and start the server
    db.sequelize.sync({ force: false }).then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }).catch(err => {
        console.error('Unable to sync database:', err);
    });
}
