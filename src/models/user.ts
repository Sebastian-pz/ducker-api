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

	likes: [
		{
			id: { type: String },
		},
	],

	recuacks: [
		{
			id: { type: String },
		},
	],

	following: [
		{
			id: { type: String, trim: true },
		},
	],

	followers: [
		{
			id: { type: String, trim: true },
		},
	],

	silenced: [
		{
			id: { type: String, trim: true },
		},
	],

	blocked: [
		{
			id: { type: String, trim: true },
		},
	],

	interests: [
		{
			interest: { type: String },
		},
	],

	cuacks: [
		{
			author: { type: String, trim: true },
			content: { type: String, trim: true },
			likes: [{ type: String }],
			recuacks: [{ type: String }],
			date: { type: Date, default: Date.now },
			reports: { type: Number },
			comments: [
				{
					author: { type: String, trim: true },
					content: { type: String, trim: true },
					likes: [{ type: String }],
					recuacks: [{ type: String }],
					date: { type: Date, default: Date.now },
					reports: { type: Number },
				},
			],
			category: { type: String },
			isPublic: { type: Boolean, default: true },
		},
	],

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
