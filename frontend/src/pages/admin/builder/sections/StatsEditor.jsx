import Repeater from '../../../../components/admin/Repeater';

const Field = ({ label, value, onChange }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    <input value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
  </div>
);

const StatsEditor = ({ data, onChange }) => {
  const stats = data?.stats || [];

  const setStats = (items) => {
    onChange({ ...(data || {}), stats: items });
  };

  const updateItem = (idx, key, val) => {
    const next = [...stats];
    next[idx] = { ...(next[idx] || {}), [key]: val };
    setStats(next);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h3 className="font-semibold">Статистика</h3>
      <Repeater
        items={stats}
        onChange={setStats}
        addLabel="Добавить пункт"
        renderItem={(item, idx) => (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Значение" value={item.value} onChange={(v) => updateItem(idx, 'value', v)} />
            <Field label="Текст" value={item.label} onChange={(v) => updateItem(idx, 'label', v)} />
          </div>
        )}
      />
    </div>
  );
};

export default StatsEditor;
