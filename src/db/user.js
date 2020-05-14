const {pool} = require('./db')

module.exports = {
    getUserById: async (id) => {
        let [user, ] = await pool.query(`
            SELECT * 
            FROM users 
            WHERE id='${id}'
        `)
        return user[0]
    },

    getUserByIdAndToken: async (id, token) => {
        let [user, ] = await pool.query(`
            SELECT * 
            FROM users 
            WHERE id='${id}'
                AND apiToken='${token}'
        `)
        return user[0]
    },

    addUser: async (id, name, surname, email, picturePath, googleToken, apiToken) => {
        let [result, ] = await pool.query(`
                INSERT INTO users(id, name, surname, email, picturePath, googleToken, apiToken) 
                VALUES ('${id}', '${name}', '${surname}', '${email}', '${picturePath}', '${googleToken}', '${apiToken}');
        `)

        return result.affectedRows==1;
    },

    setGoogleToken: async (id, googleToken) => {
        let [result, ] = await pool.query(`
            UPDATE users
            SET googleToken='${googleToken}'
            WHERE id='${id}'
        `)

        return result.affectedRows == 1
    },

    setApiToken: async (id, apiToken) => {
        let [result, ] = await pool.query(`
            UPDATE users
            SET apiToken='${apiToken}'
            WHERE id='${id}'
        `)

        return result.affectedRows == 1
    },
}