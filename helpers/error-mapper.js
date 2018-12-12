// ------------------- Funções Exportadas ------------------- //
const handleErrors = function (error, request, response, next) {
    if (error.isJoi || error.isBusiness || error.isDatabase) {
        let errorCode = 400;
        let errorStack;

        if (error.isNotFound) {
            errorCode = 404;
        }

        if (error.isBusiness || error.isDatabase) {
            if (Array.isArray(error.message)) {
                errorStack = error.message;
            } else {
                errorStack = [error.message];
            }
        } else {
            errorStack = error.details.map(getMessageFromDetail);
        }

        return response.locals._UTIL.handleRequests(errorCode, { 'message': errorStack }, response);
    }

    if(error.isAuthDenied){
        return response.locals._UTIL.handleRequests(401, { 'message': ['Não autorizado'] }, response);
    }

    if (error instanceof SyntaxError && error.type === 'entity.parse.failed') {
        return handleBodyParserParsingError(response);
    }

    console.log(error);
    response.locals._UTIL.handleRequests(500, { 'message': error.message }, response);
};

// --------------------- Funções Locais --------------------- //
function getMessageFromDetail(detail) {
    if (detail.type.startsWith('string') || detail.type === 'date.base') {
        return `Dados inválidos para o campo \'${fieldMap[detail.context.key]}\'.`;
    }
    if (detail.type === 'any.required') {
        return `O campo \'${fieldMap[detail.context.key]}\' é obrigatório.`;
    }
    if (detail.type === 'any.unknown') {
        return `O campo \'${fieldMap[detail.context.key]}\' não pode ser informado para esta ação.`;
    }
    if (detail.type === 'object.missing') {
        return `Para esta ação você deve informar ao menos um dos seguintes campos: ${getFieldNames(detail.context.peers).join(', ')}.`
    }

    return detail.message;
};

function getFieldNames(fieldArray) {
    return fieldArray.map(fieldName => fieldMap[fieldName]);
};

//Não tem o contexto do primeiro middleware de injeção do UTIL, por isso deve ser tratado de maneira diferente
function handleBodyParserParsingError(response) {
    return response.status(400).send({ 'message': 'Dados inválidos.' });
}

// --------------------- Objetos Locais --------------------- //
const fieldMap = {
    '_id': 'Identificador',
    'name': 'Nome',
    'email': 'E-mail',
    'phone': 'Telefone',
    'password': 'Senha',
    'createdAt': 'Criado em',
    'updatedAt': 'Atualizado em',
    'refreshToken': 'Refresh Token'
};

// --------------------- Module Exports --------------------- //
module.exports = handleErrors;