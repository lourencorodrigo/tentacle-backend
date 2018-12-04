const should = require('should');

// --------------- Import de arquivos do core --------------- //
const validator = require('../../helpers/validator');

describe('Validador do Usuário', function () {

    describe('#create', function () {

        it('Campos obrigatórios', function () {
            let request = {
                'body': {}
            };

            let createValidatorFunction = validator('user', 'create', 'body');

            createValidatorFunction(request, null, function (nextObject) {
                should(nextObject).be.ok();
                nextObject.should.have.property('isJoi', true);
                nextObject.should.have.property('details').with.lengthOf(4);
                nextObject.details.should.containDeep([
                    { 'message': '"name" is required', 'type': 'any.required' },
                    { 'message': '"email" is required', 'type': 'any.required' },
                    { 'message': '"phone" is required', 'type': 'any.required' },
                    { 'message': '"password" is required', 'type': 'any.required' }
                ]);
            });
        });

        it('Campos inválidos', function () {
            let request = {
                'body': {
                    'name': 'Jhon Doe',
                    'email': 'invalidEmail',
                    'phone': 'invalidPhone',
                    'password': '1'
                }
            };

            let createValidatorFunction = validator('user', 'create', 'body');

            createValidatorFunction(request, null, function (nextObject) {
                should(nextObject).be.ok();
                nextObject.should.have.property('isJoi', true);
                nextObject.should.have.property('details').with.lengthOf(3);
                nextObject.details.should.containDeep([
                    { 'message': '"email" must be a valid email', 'type': 'string.email' },
                    {
                        'message': '"phone" with value "invalidPhone" fails to match the required pattern: /^\\d{2} \\d{8,9}$/',
                        'type': 'string.regex.base'
                    },
                    { 'message': '"password" length must be at least 5 characters long', 'type': 'string.min' }
                ]);
            });
        });

        it('Limpeza de campos e dados OK', function () {
            let request = {
                'body': {
                    'name': 'Jhon Doe',
                    'email': 'validemail@gmail.com',
                    'phone': '12 121212121',
                    'password': '12345',
                    '_id': 'Should be removed',
                    'createdAt': 'Should be removed',
                    'updatedAt': 'Should be removed',
                    'randomField': 'Should be removed'
                }
            };

            let createValidatorFunction = validator('user', 'create', 'body');

            createValidatorFunction(request, null, function (nextObject) {
                should(nextObject).not.be.ok();
                request.body.should.have.properties(['name', 'email', 'phone', 'password']);
                request.body.should.not.have.any.properties(['_id', 'createdAt', 'updatedAt', 'randomField']);
            });
        });
    });

    describe('#id', function () {
        it('Campos obrigatórios', function () {
            let request = {
                'params': {}
            };

            let idValidatorFunction = validator('user', '_id', 'params');

            idValidatorFunction(request, null, function (nextObject) {
                should(nextObject).be.ok();
                nextObject.should.have.property('isJoi', true);
                nextObject.should.have.property('details').with.lengthOf(1);
                nextObject.details.should.containDeep([
                    { 'message': '"_id" is required', 'type': 'any.required' }
                ]);
            });
        });

        it('Campo inválido', function () {
            let request = {
                'params': {
                    '_id': 'invalidId'
                }
            };

            let idValidatorFunction = validator('user', '_id', 'params');

            idValidatorFunction(request, null, function (nextObject) {
                should(nextObject).be.ok();
                nextObject.should.have.property('isJoi', true);
                nextObject.should.have.property('details').with.lengthOf(1);
                nextObject.details.should.containDeep([
                    {
                        'message': '"_id" with value "invalidId" fails to match the required pattern: /^[0-9a-fA-F]{24}$/',
                        'type': 'string.regex.base'
                    }
                ]);
            });
        });

        it('Limpeza de campos e dados OK', function () {
            let request = {
                'params': {
                    'name': 'Jhon Doe',
                    '_id': '1a2b3c4d5e6f1a2b3c4d5e6f'
                }
            };

            let idValidatorFunction = validator('user', '_id', 'params');

            idValidatorFunction(request, null, function (nextObject) {
                should(nextObject).not.be.ok();
                request.params.should.have.properties(['name', '_id']);
            });
        });
    });

    describe('#search', function () {
        it('Campos inválidos', function () {
            let request = {
                'query': {
                    '_id': 'invalidId',
                    'email': 'invalidEmail',
                    'phone': 'invalidPhone'
                }
            };

            let searchValidatorFunction = validator('user', 'search', 'query');

            searchValidatorFunction(request, null, function (nextObject) {
                should(nextObject).be.ok();
                nextObject.should.have.property('isJoi', true);
                nextObject.should.have.property('details').with.lengthOf(3);
                nextObject.details.should.containDeep([
                    {
                        'message': '"_id" with value "invalidId" fails to match the required pattern: /^[0-9a-fA-F]{24}$/',
                        'type': 'string.regex.base'
                    },
                    { 'message': '"email" must be a valid email', 'type': 'string.email' },
                    {
                        'message': '"phone" with value "invalidPhone" fails to match the required pattern: /^\\d{2} \\d{8,9}$/',
                        'type': 'string.regex.base'
                    }
                ]);
            });
        });

        it('Limpeza e inserção de campos e dados OK', function () {
            let request = {
                'query': {
                    'name': 'Jhon Doe',
                    'email': 'validemail@gmail.com',
                    'phone': '12 121212121',
                    'password': '12345',
                    '_id': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'createdAt': 'Should be removed',
                    'updatedAt': 'Should be removed',
                    'randomField': 'Should be removed'
                }
            };

            let searchValidatorFunction = validator('user', 'search', 'query');

            searchValidatorFunction(request, null, function (nextObject) {
                should(nextObject).not.be.ok();
                request.query.should.have.properties(['_id', 'name', 'email', 'phone', 'page', 'limit']);
                request.query.should.not.have.any.properties(['createdAt', 'updatedAt', 'randomField', 'password']);
            });
        });
    });

    describe('#update', function () {

        it('Ao menos um campo opcional é obrigatório', function () {
            let request = {
                'body': {}
            };

            let updateValidatorFunction = validator('user', 'update', 'body');

            updateValidatorFunction(request, null, function (nextObject) {
                should(nextObject).be.ok();
                nextObject.should.have.property('isJoi', true);
                nextObject.should.have.property('details').with.lengthOf(1);
                nextObject.details.should.containDeep([
                    { 'message': '"value" must contain at least one of [name, email, phone, password]', 'type': "object.missing" }
                ]);
            });
        });

        it('Campos inválidos', function () {
            let request = {
                'body': {
                    'email': 'invalidEmail',
                    'phone': 'invalidPhone',
                    'password': '1'
                }
            };

            let updateValidatorFunction = validator('user', 'update', 'body');

            updateValidatorFunction(request, null, function (nextObject) {
                should(nextObject).be.ok();
                nextObject.should.have.property('isJoi', true);
                nextObject.should.have.property('details').with.lengthOf(3);
                nextObject.details.should.containDeep([
                    { 'message': '"email" must be a valid email', 'type': 'string.email' },
                    {
                        'message': '"phone" with value "invalidPhone" fails to match the required pattern: /^\\d{2} \\d{8,9}$/',
                        'type': 'string.regex.base'
                    },
                    { 'message': '"password" length must be at least 5 characters long', 'type': 'string.min' }
                ]);
            });
        });

        it('Limpeza de campos e dados OK', function () {
            let request = {
                'body': {
                    'name': 'Jhon Doe',
                    'email': 'validemail@gmail.com',
                    'phone': '12 121212121',
                    'password': '12345',
                    '_id': '1a2b3c4d5e6f1a2b3c4d5e6f',
                    'createdAt': 'Should be removed',
                    'updatedAt': 'Should be removed',
                    'randomField': 'Should be removed'
                }
            };

            let updateValidatorFunction = validator('user', 'update', 'body');

            updateValidatorFunction(request, null, function (nextObject) {
                should(nextObject).not.be.ok();
                request.body.should.have.properties(['name', 'email', 'phone', 'password']);
                request.body.should.not.have.any.properties(['_id', 'createdAt', 'updatedAt', 'randomField']);
            });
        });
    });
});