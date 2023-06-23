import redis from 'redis'
import {BD_HOST_REDIS,BD_PORT_REDIS} from './config.js'


export const clientRedis = redis.createClient({
    host: '192.168.99.100',
    port: 6379
});
// export const clientRedis = redis.createClient();

console.log("Redis configuraciones: ",clientRedis)

clientRedis.on('error', err => console.log('Redis Client Error', err));

// clientRedis.on('connect', function() {
//     console.log('Conexión a Redis establecida correctamente');
// });


await clientRedis.connect();


clientRedis.ping( (err, reply) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Respuesta de Redis:', reply);
    }
})




