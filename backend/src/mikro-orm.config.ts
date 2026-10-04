import { defineConfig } from '@mikro-orm/sqlite'
import { UserSchema } from './mappings/userMapping.js';
import { JobSchema } from './mappings/JobMapping.js';
import { JobApplicationSchema } from './mappings/JobApplicationMapping.js';

export default defineConfig({
    entities: [UserSchema, JobSchema, JobApplicationSchema],
    dbName: './app.db',
    debug:true
});