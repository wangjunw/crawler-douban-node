const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const categorySchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    movies: [
        {
            type: ObjectId, //ObjectId是mongodb中的一种数据类型
            ref: 'Movie'
        }
    ],
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
categorySchema.pre('save', next => {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updateddAt = Date.now();
    } else {
        this.meta.updateddAt = Date.now();
    }
    next();
});
mongoose.model('Category', categorySchema);
