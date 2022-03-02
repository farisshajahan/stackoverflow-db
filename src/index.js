import 'dotenv/config';
import Fastify from 'fastify';
import Knex from 'knex';
import { Model } from 'objection';
import knexConfig from '../knexfile.cjs';
import routes from './routes';

const knex = Knex(knexConfig[process.env.NODE_ENV]);
Model.knex(knex);

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
