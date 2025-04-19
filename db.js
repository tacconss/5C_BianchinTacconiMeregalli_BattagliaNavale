const generateDatabase = (conf, mysql) => {
    const connection = mysql.createConnection(conf);

    //Query Executers
    const executeQuery = (sql) => {
        return new Promise((resolve, reject) => {      
            connection.query(sql, function (err, result) {
                if (err) {
                    console.error(err);
                    reject(err);     
                }   
                resolve(result);         
            });
        });
    };

    //Create Table
    const createTable = async function() {
        return await executeQuery(`
            CREATE TABLE IF NOT EXISTS images ( 
               id INT PRIMARY KEY AUTO_INCREMENT, 
               url VARCHAR(255) NOT NULL 
            );
        `);
    };

    createTable();

    return {
        insert: async function (imgs) {
            const template = `INSERT INTO images (url) VALUES ('$URL');`;
            let sql = template.replace("$URL", imgs.url); 
            return await executeQuery(sql);
        },
        delete: async function (id) {
            const template = `DELETE FROM images WHERE id = $ID;`;
            let sql = template.replace("$ID", id);
            return await executeQuery(sql);
        },
        select: async function () {
            const sql = `SELECT id, url FROM images;`;
            return await executeQuery(sql);
        },
        truncate: async function () {
            const sql = `TRUNCATE TABLE images;`;
            return await executeQuery(sql);
        }
    };
};

module.exports = { generateDatabase };
