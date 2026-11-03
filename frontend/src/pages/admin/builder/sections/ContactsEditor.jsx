const Field = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-semibold mb-1.5">{label}</label>
    <input value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
  </div>
);

const ContactsEditor = ({ data, onChange }) => {
  const contacts = data?.contacts || {};

  const set = (key, val) => onChange({ ...(data || {}), contacts: { ...contacts, [key]: val } });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h3 className="font-semibold">Контакты</h3>
      <Field label="Адрес" value={contacts.address} onChange={(v) => set('address', v)} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Телефон" value={contacts.phone} onChange={(v) => set('phone', v)} />
        <Field label="Телефон href" value={contacts.phoneHref} onChange={(v) => set('phoneHref', v)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Широта" value={contacts.lat} onChange={(v) => set('lat', v)} />
        <Field label="Долгота" value={contacts.lng} onChange={(v) => set('lng', v)} />
      </div>
      <Field label="Instagram" value={contacts.instagram} onChange={(v) => set('instagram', v)} />
      <Field label="NUU ссылка" value={contacts.nuu} onChange={(v) => set('nuu', v)} />
    </div>
  );
};

export default ContactsEditor;
