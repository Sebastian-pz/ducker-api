import { Schema, model } from 'mongoose';

const userSchema = new Schema({
	fullname: {
		type: String,
		required: [true, 'The name is required'],
	},

	nickname: {
		type: String,
		required: true,
	},

	location: {
		type: String,
		required: false,
	},

	email: {
		type: String,
		required: [true, 'The email is required'],
		unique: true,
	},

	confirmedEmail: {
		type: Boolean,
		default: false,
	},

	verifiedUser: {
		type: Boolean,
		default: false,
	},

	password: {
		type: String,
		required: [true, 'The password is required'],
	},

	img: {
		type: String,
		default:
			'https://res.cloudinary.com/dak9qk0lc/image/upload/v1674141510/Ducker/user-silouette_x2jf70.png',
	},

	role: {
		type: String,
		required: true,
		enum: ['ADMIN_ROLE', 'USER_ROLE'],
		default: 'USER_ROLE',
	},

	state: {
		type: Boolean,
		default: true,
	},

	google: {
		type: Boolean,
		default: false,
	},

	description: {
		type: String,
		required: false,
	},

	creationDate: {
		type: Date,
		default: Date.now,
	},

	birthday: {
		type: Date,
		required: false,
	},

	likes: [{ type: String, trim: true }],

	recuacks: [{ type: String }],

	following: [{ type: String, trim: true }],

	followers: [{ type: String, trim: true }],

	silenced: [{ type: String, trim: true }],

	blocked: [{ type: String, trim: true }],

	interests: [{ type: String, trim: true }],

	cuacks: [{ type: String }],

	notifications: [
		{
			new: { type: Boolean, default: true },
			content: { type: String, default: '' },
			message: { type: String, require: true, default: '' },
			img: { type: String },
		},
	],

	responses: [
		{
			originalID: { type: String, required: true },
			commentID: { type: String, required: true },
		},
	],
});

userSchema.methods.toJSON = function () {
	const { __v, password, _id, ...user } = this.toObject();
	user.id = _id;

	return user;
};

export default model('User', userSchema);
