import express from 'express';
import UserRoutes from './routes/UserRoutes.js'
import { MikroORM, RequestContext } from '@mikro-orm/sqlite';
import config from './mikro-orm.config.js'
export const orm = await MikroORM.init(config);
const app = express();
app.use(express.json());
app.use((req, res, next) => {RequestContext.create(orm.em, next)})
app.use('/user', UserRoutes);
const PORT = 3000;

app.listen(PORT, () => console.log(`SERVER LISTENING AT PORT ${PORT}`));