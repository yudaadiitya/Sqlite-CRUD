-- SQLite
 CREATE TABLE bread (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
        string varchar(25) NOT NULL,
        integer INTEGER NOT NULL,
        float REAL FLOAT NOT NULL,
        date text,
        boolean BOOLEAN varchaar(5) NOT NULL
        );
INSERT INTO bread (id,string,integer,float,date,boolean)
VALUES (1, "Testing Data", 12, 1.45, "12 Desember 2017", "true");
DROP TABLE bread;
SELECT * FROM `sqlite-sequence`;
UPDATE `sqlite_sequence` SET `seq` = 0 WHERE `string` = 'bread';
DELETE FROM tab;
DELETE FROM sqlite_sequence WHERE name = 'bread';