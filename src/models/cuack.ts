import { Schema, model } from 'mongoose';

const cuackSchema = new Schema({
	type: { type: String, enum: ['cuack', 'comment'], default: 'cuack' },
	author: { type: String, trim: true, required: true },
	content: { type: String, trim: true, required: true },
	likes: [{ type: String }],
	recuacks: [{ type: String }],
	date: { type: Date, default: Date.now },
	reports: [{ type: String }],
	comments: [
		{
			type: { type: String, default: 'comment' },
			before: { type: String },
			author: { type: String, trim: true, required: true },
			content: { type: String, trim: true, required: true },
			likes: [{ type: String }],
			recuacks: [{ type: String }],
			date: { type: Date, default: Date.now },
			reports: { type: String },
		},
	],
	category: { type: String, default: '@Test' },
	isPublic: { type: Boolean, default: true },
	files: [{ type: String }],
});

export default model('Cuack', cuackSchema);
