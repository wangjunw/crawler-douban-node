const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Mixed, ObjectId } = Schema.Types;

const movieSchema = new Schema({
    doubanId: String,
    category: {
        type: ObjectId,
        ref: 'Category'
    },
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
movieSchema.pre('save', next => {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updateddAt = Date.now();
    } else {
        this.meta.updateddAt = Date.now();
    }
    next();
});
mongoose.model('Movie', movieSchema);
