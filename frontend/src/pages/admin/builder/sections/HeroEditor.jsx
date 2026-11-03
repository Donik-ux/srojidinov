import { useState } from 'react';
import { Image, Video } from 'lucide-react';
import MediaPicker from '../../../../components/admin/MediaPicker';

const Field = ({ label, value, onChange, placeholder, type = 'text' }) => (
  <div>
    <label className="block text-sm font-semibold mb-1.5">{label}</label>
    <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
  </div>
);

const TextArea = ({ label, value, onChange, rows = 3 }) => (
  <div>
    <label className="block text-sm font-semibold mb-1.5">{label}</label>
    <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} rows={rows} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" />
  </div>
);

const HeroEditor = ({ data, onChange }) => {
  const [picker, setPicker] = useState({ open: false, field: null, accept: 'image/*' });

  const set = (path, val) => {
    const next = JSON.parse(JSON.stringify(data || {}));
    const parts = path.split('.');
    let cur = next;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]]) cur[parts[i]] = {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = val;
    onChange(next);
  };

  const hero = data?.hero || {};

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h3 className="font-semibold">Главный баннер (Hero)</h3>
        <Field label="Надзаголовок" value={hero.eyebrow} onChange={(v) => set('hero.eyebrow', v)} />
        <TextArea label="Заголовок" value={hero.title} onChange={(v) => set('hero.title', v)} rows={2} />
        <TextArea label="Подзаголовок" value={hero.subtitle} onChange={(v) => set('hero.subtitle', v)} rows={3} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h3 className="font-semibold">Фон</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Видео фон</label>
            <div className="flex items-center gap-2">
              <input value={hero.video || ''} onChange={(e) => set('hero.video', e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <button onClick={() => setPicker({ open: true, field: 'hero.video', accept: 'video/*' })} className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"><Video size={16} /></button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Постер видео</label>
            <div className="flex items-center gap-2">
              <input value={hero.poster || ''} onChange={(e) => set('hero.poster', e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <button onClick={() => setPicker({ open: true, field: 'hero.poster', accept: 'image/*' })} className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"><Image size={16} /></button>
            </div>
          </div>
        </div>
      </div>

      <MediaPicker
        isOpen={picker.open}
        onClose={() => setPicker({ open: false, field: null, accept: 'image/*' })}
        accept={picker.accept}
        onSelect={(url) => set(picker.field, url)}
      />
    </div>
  );
};

export default HeroEditor;
