import { Pool, Client } from 'pg';

//const { Pool, Client} = pg;

const createDBIfNoneExists = async (client : Client) => {

    
    try {

        const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${process.env.PG_NEW_DB}'`);

        //database does not exist, create it
        if(res.rowCount == 0) {
            console.log(`${process.env.PG_NEW_DB} database not found, creating it`);
            await client.query(`CREATE DATABASE "${process.env.PG_NEW_DB}";`);
            console.log(`created database ${process.env.PG_NEW_DB}`);

        } else {
            //it exists
            console.log(`${process.env.PG_NEW_DB} database exists.`);
        }
        

    } catch(err) {
        console.error("Error: ", err);
    }

}

const createTables = async(pool : Pool) => {
    //cerate tables if they dont already exist
    try {
        await pool.query("BEGIN");

        console.log('Creating tables\n')

        await pool.query(`
            CREATE TABLE IF NOT EXISTS visitor_analytics(
                visitor_analytics_id SERIAL PRIMARY KEY,
                username VARCHAR(10) DEFAULT 'guest',
                referral_site VARCHAR(50),
                time TIMESTAMP NOT NULL,
                link_clicked VARCHAR(50)
            )`
        );

        await pool.query("COMMIT");

    } catch(err) {
        await pool.query("ROLLBACK")
        console.error("Error: ", err);
    }

}

const initDB = async() => {
        //try client i guess

    //Create initial connection
    const client = new Client({
        host: process.env.PG_HOST,
        user: process.env.PG_USER,
        password: process.env.PG_PASS,
        database:process.env.PG_DB,
        port: Number(process.env.PG_PORT)
    });



    //establish initial connection
    //create DB if it doesnt exist
    try {
        console.log("Connecting to client");
        await client.connect();
        await createDBIfNoneExists(client);

    } catch(err) {
        console.error("Error: ", err);
    } finally {
        //close the connection
        console.log("Client connection ending");
        await client.end();
    }


    //establish connection with new DB
    const pool = new Pool( {
        host: process.env.PG_HOST,
        user: process.env.PG_USER,
        password: process.env.PG_PASS,
        database:process.env.PG_NEW_DB,
        port: Number(process.env.PG_PORT)
    });



    try {
        //connect to new DB
        console.log(`Connecting the new DB ${process.env.PG_NEW_DB} with pool\n`);
        //await pool.query("SELECT NOW()");

        // Create table if they dont exist
        await createTables(pool);

    } catch(err) {
        console.log("Error:", err);
    } finally {
        //console.log(`Ending pool connection ${process.env.PG_NEW_DB}`);
        //await pool.end();
        //
    }


    console.log(`Ending pool connection ${process.env.PG_NEW_DB}`);
    await pool.end();

}

let dbInitialized = false;

async function initializeOnce() {
    if(!dbInitialized) {
        await initDB();
        dbInitialized = true;
        console.log("DB was initted once on server start");
    }
}

//export for the route handler
export {initDB, initializeOnce};