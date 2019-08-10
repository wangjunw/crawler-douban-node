const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Bcrypt = require('bcrypt');
const SALT_WORK_FACTORY = 10; //加密复杂度
const MAX_LOGIN_ATTEMPTS = 5; //最大登录次数
const LOCK_TIME = 2 * 60 * 60 * 1000; //锁定时间
const userSchema = new Schema({
    username: {
        unique: true,
        required: true,
        type: String
    },
    email: {
        unique: true,
        required: true,
        type: String
    },
    password: {
        unique: true,
        type: String
    },
    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: Number,
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
// 增加isLocked字段，但是不会保存到数据库中
userSchema.virtual('isLocked').get(() => {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});
userSchema.pre('save', function(next) {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updateddAt = Date.now();
    } else {
        this.meta.updateddAt = Date.now();
    }
    next();
});
userSchema.pre('save', function(next) {
    if (!this.isModified('password')) return next();
    // 密码加密
    Bcrypt.genSalt(SALT_WORK_FACTORY, (err, salt) => {
        if (err) return next(err);
        Bcrypt.hash(this.password, salt, (error, has) => {
            if (error) return next(error);
            this.password = hash;
            next();
        });
    });
    next();
});
userSchema.methods = {
    comparePassword: (_password, password) => {
        return new Promise((resolve, reject) => {
            Bcrypt.compare(_password, password, (err, isMatch) => {
                if (!err) resolve(isMatch);
                else reject(err);
            });
        });
    },
    // 判断当前用户是否超过最大登录次数
    inLoginAttepts: user => {
        return new Promise((resolve, reject) => {
            // 如果锁定的时间大于当前时间则当前是锁定的状态
            if (this.lockUntil && this.lockUntil > Date.now()) {
                this.update(
                    {
                        $set: {
                            loginAttempts: 1
                        },
                        $unset: {
                            lockUntil: 1
                        }
                    },
                    err => {
                        if (!err) resolve(true);
                        else reject(err);
                    }
                );
            } else {
                let updates = {
                    $inc: {
                        loginAttempts: 1
                    }
                };
                // 如果超过最大次数，设置锁定时间位当前时间+锁的时间
                if (
                    this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS &&
                    this.isLocked
                ) {
                    updates.$set = {
                        lockUntil: Date.now() + LOCK_TIME
                    };
                }
                this.update(updates, err => {
                    if (!err) resolve(true);
                    else reject(err);
                });
            }
        });
    }
};
mongoose.model('User', userSchema);
