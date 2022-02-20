import 'dotenv/config';
import Fastify from 'fastify';
import routes from './routes';

const fastify = Fastify({ logger: true });

fastify.register(routes);

const start = async () => {
  try {
    fastify.listen(parseInt(process.env.SERVER_PORT, 10), process.env.SERVER_IP);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
