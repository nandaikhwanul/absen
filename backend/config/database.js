import {Sequelize} from "sequelize";

const db = new Sequelize('absen','root','',{
    host: 'localhost',
    dialect: 'mysql'
});

export default db;