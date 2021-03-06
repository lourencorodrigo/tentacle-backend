// ------------------- Funções Exportadas ------------------- //
const save = async function (request, response, next) {
    try {
        let promisseStack = [
            response.locals._MODELS.user.countDocuments({ 'phone': request.body.phone }).exec(),
            response.locals._MODELS.user.countDocuments({ 'email': request.body.email }).exec(),
            response.locals._MODELS.state.countDocuments({ '_id': request.body.state, 'cities': { '$in': [request.body.city] } }).exec()
        ];

        let resolvedPromisses = await Promise.all(promisseStack);

        let validationErrors = validateDataFromUser(resolvedPromisses);

        if (validationErrors && validationErrors.length > 0) {
            return next({ 'isBusiness': true, 'message': validationErrors });
        }

        next();
    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
};

const update = async function (request, response, next) {
    try {
        if (request.params._id !== response.locals._USER._id + '') {
            return next({ 'isForbidden': true });
        }

        let promisseStack = [];

        if (request.body.phone) {
            promisseStack.push(
                response.locals._MODELS.user.countDocuments(
                    {
                        '_id': { '$ne': response.locals._MONGOOSE.Types.ObjectId(request.params._id) },
                        'phone': request.body.phone
                    }
                ).exec()
            );
        } else {
            promisseStack.push(0);
        }

        if (request.body.email) {
            promisseStack.push(
                response.locals._MODELS.user.countDocuments(
                    {
                        '_id': { '$ne': response.locals._MONGOOSE.Types.ObjectId(request.params._id) },
                        'email': request.body.email
                    }
                ).exec()
            );
        } else {
            promisseStack.push(0);
        }

        if (request.body.state) {
            promisseStack.push(
                response.locals._MODELS.state.countDocuments({ '_id': request.body.state, 'cities': { '$in': [request.body.city] } }).exec()
            );
        } else {
            promisseStack.push(1);
        }

        promisseStack.push(
            response.locals._MODELS.user.findById(request.params._id).exec()
        );

        let resolvedPromisses = await Promise.all(promisseStack);

        if (!resolvedPromisses[3]) {
            return next({ 'isBusiness': true, 'message': 'Usuário não encontrado', 'isNotFound': true });
        }

        let validationErrors = validateDataFromUser(resolvedPromisses);

        if (validationErrors && validationErrors.length > 0) {
            return next({ 'isBusiness': true, 'message': validationErrors });
        }

        next();
    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
};

const search = async function (request, response, next) {
    try {
        response.locals.pagination = response.locals._UTIL.resolvePagination(request.query);

        request.query = response.locals._UTIL.transformObjectToQuery(request.query);
        next();
    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
};

const remove = async function (request, response, next) {
    try {
        if (request.params._id !== response.locals._USER._id + '') {
            return next({ 'isForbidden': true });
        }

        next();
    } catch (error) {
        /* istanbul ignore next */
        next(error);
    }
};

// --------------------- Funções Locais --------------------- //
function validateDataFromUser(resolvedPromisses) {
    let validationErrors = [];

    if (resolvedPromisses[0] > 0) {
        validationErrors.push('Telefone já cadastrado');
    }

    if (resolvedPromisses[1] > 0) {
        validationErrors.push('E-mail já cadastrado');
    }

    if (resolvedPromisses[2] !== 1) {
        validationErrors.push('Dados inválidos para o campo Estado/Cidade');
    }

    return validationErrors;
};

// --------------------- Module Exports --------------------- //
module.exports = {
    'save': save,
    'update': update,
    'remove': remove,
    'search': search
};
