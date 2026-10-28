import { useState } from 'react';
import * as Icons from 'lucide-react';
import { Search } from 'lucide-react';
import Modal from '../ui/Modal';

const ICON_LIST = [
  'Atom','BookOpen','Bus','CalendarDays','CheckCircle2','FileText','FlaskConical','GraduationCap','Landmark','Microscope','Phone','Sparkles','Users','TrendingUp','Award','BookMarked','ClipboardList','Globe','Heart','MapPin','School','Star','Trophy','UsersRound'
];

const IconPicker = ({ isOpen, onClose, onSelect, value }) => {
  const [search, setSearch] = useState('');

  const filtered = ICON_LIST.filter((name) => name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Выбрать иконку">
      <div className="space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm"
          />
        </div>
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-[320px] overflow-y-auto">
          {filtered.map((name) => {
            const Icon = Icons[name];
            if (!Icon) return null;
            return (
              <button
                key={name}
                onClick={() => {
                  onSelect(name);
                  onClose();
                }}
                className={`flex items-center justify-center h-10 rounded-lg border ${value === name ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 hover:border-gray-300'}`}
                title={name}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default IconPicker;
