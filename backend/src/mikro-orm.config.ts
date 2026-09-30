import { defineConfig } from '@mikro-orm/sqlite'

export default defineConfig({
    dbName: '../app.db',
    debug:true
});