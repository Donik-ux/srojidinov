import mongoose from 'mongoose';

const contentEntrySchema = new mongoose.Schema({
  section: { type: String, required: true, index: true },
  slug: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

contentEntrySchema.index({ section: 1, slug: 1 }, { unique: true });

const ContentEntry = mongoose.model('ContentEntry', contentEntrySchema);
export default ContentEntry;
