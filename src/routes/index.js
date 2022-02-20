const routes = (fastify, opt, next) => {
  fastify.get('/', () => ({ hello: 'world' }));
  next();
};

export default routes;
