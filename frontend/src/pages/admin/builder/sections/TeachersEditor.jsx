import { useState } from 'react';
import Repeater from '../../../../components/admin/Repeater';
import MediaPicker from '../../../../components/admin/MediaPicker';
import { Image } from 'lucide-react';

const Field = ({ label, value, onChange }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    <input value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
  </div>
);

const TeachersEditor = ({ data, onChange }) => {
  const [picker, setPicker] = useState({ open: false, idx: null });
  const teachers = data?.teachers || [];

  const setTeachers = (items) => onChange({ ...(data || {}), teachers: items });

  const updateItem = (idx, key, val) => {
    const next = [...teachers];
    next[idx] = { ...(next[idx] || {}), [key]: val };
    setTeachers(next);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h3 className="font-semibold">Преподаватели</h3>
      <p className="text-xs text-gray-500">Можно редактировать блок "Устозлар" на главной</p>
      <Repeater
        items={teachers}
        onChange={setTeachers}
        addLabel="Добавить преподавателя"
        renderItem={(item, idx) => (
          <div className="grid grid-cols-1 md:grid-cols-[80px_1fr_1fr] gap-3 items-end">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Фото</label>
              <button onClick={() => setPicker({ open: true, idx })} className="w-20 h-20 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
                {item.image ? <img src={item.image.startsWith('http') ? item.image : (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}${item.image.startsWith('/uploads') ? '' : ''}${item.image}` : item.image)} alt="" className="w-full h-full object-cover" /> : <Image size={18} className="text-gray-400" />}
              </button>
            </div>
            <Field label="Предмет/ФИО" value={item.subject} onChange={(v) => updateItem(idx, 'subject', v)} />
            <Field label="Роль (необязательно)" value={item.role} onChange={(v) => updateItem(idx, 'role', v)} />
          </div>
        )}
      />
      <MediaPicker
        isOpen={picker.open}
        onClose={() => setPicker({ open: false, idx: null })}
        accept="image/*"
        onSelect={(url) => {
          if (picker.idx !== null) updateItem(picker.idx, 'image', url);
        }}
      />
    </div>
  );
};

export default TeachersEditor;
