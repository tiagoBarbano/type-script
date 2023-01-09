import createConnectionPool, { sql } from '@databases/pg';
import dotenv from 'dotenv';

export { sql };

dotenv.config();
const url_db_pg = process.env.DB_PG;  

const db = createConnectionPool(url_db_pg);
export default db;
