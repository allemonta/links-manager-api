const {pool} = require('./db')
const sectionDB = require('./section')
const userDB = require('./user')

module.exports = {
    getPageById: async (id) => {
        let [page, ] = await pool.query(`
            SELECT * 
            FROM page 
            WHERE id=${id}
        `)

        page = page[0]
        page.sections = await sectionDB.getSectionsByPage(page.id)
        page.sharedUsers = await userDB.getSharedUserByPage(page.id)

        return page
    },
    
    getPages: async () => {
        let [pages, ] = await pool.query(`SELECT * FROM page`)

        for (i in pages) {
            pages[i].sections = await sectionDB.getSectionsByPage(pages[i].id)
        }

        return pages
    },

    getpagesOnly: async () => {
        let [pages, ] = await pool.query(`SELECT * FROM page`)
        return pages
    },

    getpagesByUser: async (idUser) => {
        let [pages, ] = await pool.query(`
            SELECT * 
            FROM page
            where idUser = '${idUser}'
        `)
        return pages
    },

    deletePage: async (id) => {
        let [result, ] = await pool.query(`
            DELETE FROM page 
            WHERE id=${id}
        `)

        return result.affectedRows == 1
    },

    addPage: async (title, description, idUser, private) => {
        let [result, ] = await pool.query(`
                INSERT INTO page(id, title, description, idUser, private) 
                VALUES (NULL, '${title}', '${description}', '${idUser}', ${private});

                SELECT * FROM page 
                WHERE id=LAST_INSERT_ID() ;
        `)
        result = result[1]['0']

        return {...result};
    },

    updatepage: async (id, title, description, private) => {
        let [result, ] = await pool.query(`
                UPDATE page
                SET
                    title='${title}',
                    description='${description}',
                    private=${private}
                WHERE id=${id}
        `)

        return result.affectedRows==1;
    },
}