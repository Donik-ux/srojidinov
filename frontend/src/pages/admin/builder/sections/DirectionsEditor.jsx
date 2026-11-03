import { useState } from 'react';
import Repeater from '../../../../components/admin/Repeater';
import IconPicker from '../../../../components/admin/IconPicker';

const Field = ({ label, value, onChange }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    <input value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
  </div>
);

const TextArea = ({ label, value, onChange }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" />
  </div>
);

const DirectionsEditor = ({ data, onChange }) => {
  const [iconPicker, setIconPicker] = useState({ open: false, idx: null });
  const directions = data?.directions || [];

  const setDirections = (items) => onChange({ ...(data || {}), directions: items });

  const updateItem = (idx, key, val) => {
    const next = [...directions];
    next[idx] = { ...(next[idx] || {}), [key]: val };
    setDirections(next);
  };

  const updateSubjects = (idx, val) => {
    const subjects = val.split(',').map((s) => s.trim()).filter(Boolean);
    updateItem(idx, 'subjects', subjects);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h3 className="font-semibold">Направления</h3>
      <Repeater
        items={directions}
        onChange={setDirections}
        addLabel="Добавить направление"
        renderItem={(item, idx) => (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Название" value={item.title} onChange={(v) => updateItem(idx, 'title', v)} />
              <div>
                <label className="block text-xs text-gray-500 mb-1">Иконка</label>
                <button onClick={() => setIconPicker({ open: true, idx })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-left">{item.icon || 'Выбрать'}</button>
              </div>
            </div>
            <Field label="Предметы (через запятую)" value={(item.subjects || []).join(', ')} onChange={(v) => updateSubjects(idx, v)} />
            <TextArea label="Описание" value={item.text} onChange={(v) => updateItem(idx, 'text', v)} />
            <TextArea label="Кому подходит" value={item.fit} onChange={(v) => updateItem(idx, 'fit', v)} />
          </div>
        )}
      />
      <IconPicker
        isOpen={iconPicker.open}
        onClose={() => setIconPicker({ open: false, idx: null })}
        value={iconPicker.idx !== null ? directions[iconPicker.idx]?.icon : ''}
        onSelect={(name) => {
          if (iconPicker.idx !== null) updateItem(iconPicker.idx, 'icon', name);
        }}
      />
    </div>
  );
};

export default DirectionsEditor;
