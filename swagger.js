const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info:{
        title: 'To-Do List API Documentation',
        description: 'To-Do List API Documentation',
    },
    host: 'localhost:3000/api',
};

const outputFile = './swagger-output.json';
const routes = ['./routes/routes.js'];

swaggerAutogen(outputFile, routes, doc);