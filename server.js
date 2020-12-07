const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const url = require('url');
const db = new sqlite3.Database(__dirname + '/data.db', (err) => {
    if (err) throw err;
    console.log('db connected');
});
const app = express();
const bp = require('body-parser');
const e = require('express');

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(bp.urlencoded({ extended: false }));

app.use('/', express.static(path.join(__dirname, 'public')))

// Menampilkan list
app.get('/', (req, res) => {
    const { check1, check2, check3, check4, check5, check6, id, string, float, startdate, enddate, boolean } = req.query;
    let page = req.query.page || 1;
    let perPage = 3;
    let ofset = (page - 1) * perPage;
    //let url = req.url == '/' ? '/?page=1' : req.url;
    let result = [];
    let filter = false;
    
    if(check1 && id) {
        result.push(`id = '${id}'`)
        filter = true;
    }
    
    if(check2 && string) {
        result.push(`string = '${string}'`)
        filter = true;
    }
    
    if(check3 && integer) {
        result.push(`integer = '${integer}'`)
        filter = true;
    }
    
    if(check4 && float) {
        result.push(`float = '${float}'`)
        filter = true;
    }
    
    if(check5 && startdate && enddate) {
        result.push(`date BETWEEN '${startdate}' AND '${enddate}'`)
        filter = true;
    }
    
    if(check6 && boolean) {
        result.push(`boolean = '${boolean}'`)
        filter = true;
    }
    
    let sql = `SELECT COUNT(*) AS total FROM bread`
    if(filter == true) {
        sql += ` WHERE ${result.join(' AND ')}`
    }
        db.all(sql, (err, count) => {
            if (err) throw err;
            let rows = count[0].total // menghitung jumlah data pada tabel
            let pages = Math.ceil(rows / perPage);
            sql = `SELECT * FROM bread`;
            if (filter) {
                sql += ` WHERE ${result.join(' AND ')}`
            }
            sql += ` LIMIT ${perPage} OFFSET ${ofset}`
            db.all(sql, (err,rows) => {
                res.render('list', { bread: rows,page,pages, query: req.query, url, title : 'BREAD'});
            })
        });
    });
//});
// GET ADD
app.get('/add', (req, res) => {
    const id = req.params.id;
            res.render('add');
        });
// Menambahkan Data
app.post('/add', (req, res) => {
    let id = req.params.id;
    const {string, integer, float, date, boolean } = req.body;
    db.serialize(() => {
        const sql = `INSERT INTO bread (string, integer, float, date, boolean) 
        VALUES ('${string}', '${integer}', '${float}', '${date}', '${boolean}')`;
        const resetauto = `DELETE FROM sqlite_sequence WHERE name = 'bread';`
        db.run(sql, (err, rows) => {
            if (err) throw err;
            db.run(resetauto, (err,rows) => {
                if (err) throw err;
            })
            res.redirect('/');
        });
    });
});
//Mengedit Data
app.get('/edit/:id', (req, res) => {
    const {id} = req.params;;
    db.serialize(() => {
        const sql = `SELECT * FROM bread WHERE id='${id}'`;
        db.get(sql, (err, rows) => {
            if (err) throw err;
            res.render('edit.ejs', { bread: rows });
        });
    });
});
app.post('/edit/:id', (req, res) => {
    const {id} = req.params;
    const{string, integer, float, date, boolean} = req.body;
    db.serialize(() => {
        const sql = `UPDATE bread SET string='${string}', integer='${integer}', float='${float}', date='${date}', boolean='${boolean}' WHERE id='${id}'`;
        db.run(sql, (err) => {
            if (err) throw err;
            res.redirect('/');
        });
    });
});
//Menghapus Data
app.get('/delete/:id', (req, res) => {
    const {id} = req.params;
    db.serialize(() => {
        const sql = `DELETE FROM bread WHERE id = '${id}'`;
        db.run(sql, (err) => {
            if (err) throw err;
            res.redirect('/');
        });
    });
});
app.listen(3000, () => {
    console.log('Web ini berjalan di port 3000')
});