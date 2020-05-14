const {pool} = require('./db')

module.exports = {
    getItemById: async (id) => {
        let [result, ] = await pool.query(`
            SELECT *
            FROM item,  
            WHERE id=${id}
        `)
        return result[0]
    },

    getItemsByUser: async (userId) => {
        let [result, ] = await pool.query(`
            SELECT *
            FROM item
        `)
        return result
    },

    getItemsBySection: async (idSection) => {
        let [result, ] = await pool.query(`
            SELECT *
            FROM item 
            WHERE idSection=${idSection} 
        `)
        return result
    },

    getItemsBySectionVisible: async (idSection) => {
        let [result, ] = await pool.query(`
            SELECT *
            FROM item 
            WHERE idSection=${idSection} 
                AND visible = true
        `)
        return result
    },

    addItem: async (title, path, visible, nested, idSection) => {

        let [result, ] = await pool.query(`
                INSERT INTO item(id, title, path, visible, nested, idSection) 
                VALUES (NULL, '${title}', '${path}', ${visible}, ${nested}, ${idSection});

                SELECT *
                FROM item
                WHERE id=LAST_INSERT_ID() 
        `)
        result = result[1]['0']

        return {...result};
    },

    deleteItem: async (id) => {
        let [result, ] = await pool.query(`
            DELETE FROM item 
            WHERE id=${id} 
        `)

        return result.affectedRows == 1
    },

    updateItem: async (id, path, title, visible, nested) => {
        let [result, ] = await pool.query(`
                UPDATE item
                SET
                    path='${path}', 
                    title='${title}', 
                    visible=${visible}, 
                    nested=${nested}
                WHERE id=${id}
        `)
        

        return result.affectedRows == 1;
    },
}