import mongoose from "mongoose";
const Schema = mongoose.Schema;

const linksSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    original_name: {
        type: String, 
        required: true
    },
    downloads: {
        type: Number,
        default: 1
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        default: null
    },
    password: {
        type: String,
        default: null
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

const Links = mongoose.model('Links', linksSchema);

export default Links;