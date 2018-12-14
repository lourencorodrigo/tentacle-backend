// ----------------- Import de dependências ----------------- //
const passport = require('passport');

// --------------- Import de arquivos do core --------------- //
const defMethods = require('./helpers/default-methods');
const modelInjector = require('./helpers/model-injector');
const validador = require('./helpers/validator');

// --------------- Import de regras de negócio -------------- //
const brUser = require('./business-rule/br-user');
const brAccess = require('./business-rule/br-access');

// ------------------ Import de repositórios ---------------- //
const repoUser = require('./repositories/repo-user');
const repoToken = require('./repositories/repo-token');


const privateRoute = passport.authenticate('jwt', { session: false });

// ------------------- Funções Exportadas ------------------- //
const routes = function (app) {

  app.route('/').get(defMethods.route, defMethods.requestHandler);

  app.route('/users')
    .get(modelInjector('user'), privateRoute, validador('user', 'search', 'query'), brUser.search, repoUser.search, defMethods.requestHandler)
    .post(modelInjector('user'), validador('user', 'create', 'body'), brUser.save, repoUser.save, defMethods.requestHandler);

  app.route('/users/:_id')
    .get(modelInjector('user'), privateRoute, validador('user', '_id', 'params'), repoUser.findById, defMethods.requestHandler)
    .delete(modelInjector('user'), privateRoute, validador('user', '_id', 'params'), brUser.remove, repoUser.remove, defMethods.requestHandler)
    .patch(
      modelInjector('user'), privateRoute, validador('user', '_id', 'params'), validador('user', 'update', 'body'),
      brUser.update, repoUser.update, defMethods.requestHandler
    );

  app.route('/login')
    .post(modelInjector('user', 'token'), validador('access', 'login', 'body'),
      brAccess.logIn, repoToken.saveOrUpdate, defMethods.requestHandler);
  app.route('/refresh-token')
    .post(modelInjector('user', 'token'), validador('access', 'refreshToken', 'body'),
      brAccess.refreshToken, repoToken.saveOrUpdate, defMethods.requestHandler);
};

// --------------------- Module Exports --------------------- //
module.exports = routes;