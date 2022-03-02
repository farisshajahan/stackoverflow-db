import Crawler from '../crawler';

const crawler = Crawler();
let crawlerRunning = false;

const routes = (fastify, opt, next) => {
  fastify.get('/start', (request, reply) => {
    if (!crawlerRunning) {
      crawlerRunning = true;
      crawler.run().finally(() => {
        crawlerRunning = false;
      });
      reply.status(202).header('Content-Type', 'application/json; charset=utf-8').send();
    } else
      reply
        .status(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({ message: 'Already running' });
  });
  next();
};

export default routes;
