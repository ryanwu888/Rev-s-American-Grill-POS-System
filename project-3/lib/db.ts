
const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'csce331_904_01_user',
  host: 'csce-315-db.engr.tamu.edu',
  database: 'csce331_904_01_p3_db',
  password: 'Boba5672',
  port: 5432,
})

export const fetchDataFromDB = async() => {
    try{
        const client = await pool.connect();
        console.log("connected to database");

        const result = await client.query("SELECT * FROM drink;");
        const data = result.rows;
        console.log("Fetched data from db: ", data);

        client.release();
        return data;
    } catch(error){
        console.error("Error fetching data: ", error);
        throw error;
    }
};

// fetchDataFromDB().then(data => {
//     console.log("Received data: ", data);
// })
// .catch(error => {
//     console.error("Error fetching data:", error);
// });