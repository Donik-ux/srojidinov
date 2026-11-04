import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  grade: { type: String, trim: true },
  course: { type: mongoose.Schema.Types.Mixed, default: null },
  status: {
    type: String,
    enum: ['yangi', "ko'rib_chiqilmoqda", 'qabul_qilindi', 'rad_etildi'],
    default: 'yangi',
  },
  note: { type: String, default: '' },
}, { timestamps: true });

applicationSchema.index({ createdAt: -1 });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
