const {pool} = require('./db')

module.exports = {
    getSharedPagesByUser: async (idUser) => {
        let [result, ] = await pool.query(`
            SELECT *
            FROM sharedPage
            WHERE isUser = '${idUser}'
        `)
        return result
    },

    getSharedPagesByPage: async (idUser, idPage) => {
        let [result, ] = await pool.query(`
            SELECT *
            FROM sharedPage
            WHERE idPage = ${idPage}
                AND idUser = '${idUser}'
        `)
        return result
    },

    addSharedPage: async (idUser, idPage, editable) => {

        let [result, ] = await pool.query(`
                INSERT INTO sharedPage(id, idUser, idPage, editable) 
                VALUES (NULL, '${idUser}', ${idPage}, ${editable});

                SELECT *
                FROM sharedPage
                WHERE id=LAST_INSERT_ID() 
        `)
        result = result[1]['0']

        return {...result};
    },

    deleteSharedPage: async (id) => {
        let [result, ] = await pool.query(`
            DELETE FROM sharedPage 
            WHERE id=${id} 
        `)

        return result.affectedRows == 1
    },

    updateSharedPage: async (id, editable) => {
        let [result, ] = await pool.query(`
                UPDATE sharedPage
                SET
                    editable=${editable}
                WHERE id=${id}
        `)
        

        return result.affectedRows == 1;
    },
}