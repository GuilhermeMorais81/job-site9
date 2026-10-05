import express from 'express';
import { MikroORM, RequestContext } from '@mikro-orm/sqlite';
import config from './mikro-orm.config.js'
import { jobRoutes } from './routes/JobRoutes.js';
import { userRoutes } from './routes/UserRoutes.js';
export const orm = await MikroORM.init(config);
const app = express();
app.use(express.json());
app.use((req, res, next) => {RequestContext.create(orm.em, next)})
app.use('/user', userRoutes);
app.use('/job', jobRoutes);
const PORT = 3000;

app.listen(PORT, () => console.log(`SERVER LISTENING AT PORT ${PORT}`));