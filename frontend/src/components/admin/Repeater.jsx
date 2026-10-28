import { Plus, Trash2, GripVertical } from 'lucide-react';
import Button from '../ui/Button';

const Repeater = ({ items = [], onChange, renderItem, addLabel = 'Добавить', minItems = 0 }) => {
  const add = () => {
    onChange([...(items || []), {}]);
  };

  const remove = (idx) => {
    if ((items || []).length <= minItems) return;
    const next = [...items];
    next.splice(idx, 1);
    onChange(next);
  };

  const update = (idx, value) => {
    const next = [...items];
    next[idx] = value;
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {(items || []).map((item, idx) => (
        <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-white">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2 text-gray-400">
              <GripVertical size={16} />
              <span className="text-xs">#{idx + 1}</span>
            </div>
            <button
              onClick={() => remove(idx)}
              className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"
              disabled={(items || []).length <= minItems}
            >
              <Trash2 size={16} />
            </button>
          </div>
          {renderItem(item, idx, update)}
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={add}>
        <Plus size={16} />
        {addLabel}
      </Button>
    </div>
  );
};

export default Repeater;
