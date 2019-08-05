const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;

const MovieSchema = new Schema({
    doubanId: String,
    rate: Number,
    title: String,
    summary: String,
    video: String,
    videoKey: String,
    posterKey: String,
    coverKey: String,
    poster: String,
    cover: String,
    rawTitle: String,
    movieTypes: [String],
    pubdate: Mixed,
    year: Number,
    tags: [String],
    meta: {
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updateddAt: {
            type: Date,
            default: Date.now()
        }
    }
});
mongoose.model('Movie', MovieSchema);
