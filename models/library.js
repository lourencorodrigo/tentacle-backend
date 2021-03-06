// ----------------- Import de dependências ----------------- //
const mongoose = require('mongoose');

const LibraryMediaSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ownerName: {
        type: String
    }
});

const LibrarySchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId
    },
    title: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: mongoose.Schema.Types.Date
    },
    updatedAt: {
        type: mongoose.Schema.Types.Date
    },
    mediaPs3: [LibraryMediaSchema],
    mediaPs4: [LibraryMediaSchema],
    mediaXbox360: [LibraryMediaSchema],
    mediaXboxOne: [LibraryMediaSchema],
    mediaNintendoSwitch: [LibraryMediaSchema],
    mediaNintendo3ds: [LibraryMediaSchema]
});

const createView = function (db) {
    db.createCollection(
        'library',
        {
            viewOn: 'games',
            pipeline: [
                { $sort: { 'createdAt': -1 } },
                {
                    $lookup: {
                        from: 'media',
                        let: { game_id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$platform', 'PS3'] },
                                            { $eq: ['$game', '$$game_id'] }
                                        ]
                                    }
                                }
                            },
                            { $project: { _id: 1, owner: 1 } },
                            { $lookup: { from: 'users', localField: 'owner', foreignField: '_id', as: 'ownerData' } },
                            { $unwind: '$ownerData' },
                            {
                                $addFields: {
                                    'ownerName': '$ownerData.name'
                                }
                            },
                            { $project: { 'ownerData': 0 } }
                        ],
                        as: 'mediaPs3'
                    }
                },
                {
                    $lookup: {
                        from: 'media',
                        let: { game_id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$platform', 'PS4'] },
                                            { $eq: ['$game', '$$game_id'] }
                                        ]
                                    }
                                }
                            },
                            { $project: { _id: 1, owner: 1 } },
                            { $lookup: { from: 'users', localField: 'owner', foreignField: '_id', as: 'ownerData' } },
                            { $unwind: '$ownerData' },
                            {
                                $addFields: {
                                    'ownerName': '$ownerData.name'
                                }
                            },
                            { $project: { 'ownerData': 0 } }
                        ],
                        as: 'mediaPs4'
                    }
                },
                {
                    $lookup: {
                        from: 'media',
                        let: { game_id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$platform', 'XBOX360'] },
                                            { $eq: ['$game', '$$game_id'] }
                                        ]
                                    }
                                }
                            },
                            { $project: { _id: 1, owner: 1 } },
                            { $lookup: { from: 'users', localField: 'owner', foreignField: '_id', as: 'ownerData' } },
                            { $unwind: '$ownerData' },
                            {
                                $addFields: {
                                    'ownerName': '$ownerData.name'
                                }
                            },
                            { $project: { 'ownerData': 0 } }
                        ],
                        as: 'mediaXbox360'
                    }
                },
                {
                    $lookup: {
                        from: 'media',
                        let: { game_id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$platform', 'XBOXONE'] },
                                            { $eq: ['$game', '$$game_id'] }
                                        ]
                                    }
                                }
                            },
                            { $project: { _id: 1, owner: 1 } },
                            { $lookup: { from: 'users', localField: 'owner', foreignField: '_id', as: 'ownerData' } },
                            { $unwind: '$ownerData' },
                            {
                                $addFields: {
                                    'ownerName': '$ownerData.name'
                                }
                            },
                            { $project: { 'ownerData': 0 } }
                        ],
                        as: 'mediaXboxOne'
                    }
                },
                {
                    $lookup: {
                        from: 'media',
                        let: { game_id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$platform', 'NINTENDO3DS'] },
                                            { $eq: ['$game', '$$game_id'] }
                                        ]
                                    }
                                }
                            },
                            { $project: { _id: 1, owner: 1 } },
                            { $lookup: { from: 'users', localField: 'owner', foreignField: '_id', as: 'ownerData' } },
                            { $unwind: '$ownerData' },
                            {
                                $addFields: {
                                    'ownerName': '$ownerData.name'
                                }
                            },
                            { $project: { 'ownerData': 0 } }
                        ],
                        as: 'mediaNintendo3ds'
                    }
                },
                {
                    $lookup: {
                        from: 'media',
                        let: { game_id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$platform', 'NINTENDOSWITCH'] },
                                            { $eq: ['$game', '$$game_id'] }
                                        ]
                                    }
                                }
                            },
                            { $project: { _id: 1, owner: 1 } },
                            { $lookup: { from: 'users', localField: 'owner', foreignField: '_id', as: 'ownerData' } },
                            { $unwind: '$ownerData' },
                            {
                                $addFields: {
                                    'ownerName': '$ownerData.name'
                                }
                            },
                            { $project: { 'ownerData': 0 } }
                        ],
                        as: 'mediaNintendoSwitch'
                    }
                },
                {
                    $match: {
                        $or: [
                            { 'mediaPs3': { $exists: true, $ne: [] } },
                            { 'mediaPs4': { $exists: true, $ne: [] } },
                            { 'mediaXbox360': { $exists: true, $ne: [] } },
                            { 'mediaXboxOne': { $exists: true, $ne: [] } },
                            { 'mediaNintendo3ds': { $exists: true, $ne: [] } },
                            { 'mediaNintendoSwitch': { $exists: true, $ne: [] } }
                        ]
                    }
                }
            ]
        });
};

// --------------------- Module Exports --------------------- //
module.exports = {
    'model': mongoose.model('Library', LibrarySchema, 'library'),
    'createView': createView
};
