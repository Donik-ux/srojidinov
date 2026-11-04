import mongoose from 'mongoose';

const siteContentSchema = new mongoose.Schema({
  language: {
    type: String,
    enum: ['uz', 'ru', 'en'],
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
}, { timestamps: true });

siteContentSchema.index({ language: 1 }, { unique: true });

const SiteContent = mongoose.model('SiteContent', siteContentSchema);
export default SiteContent;
