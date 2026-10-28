import { useEffect, useRef, useState } from 'react';
import { Image, Upload, X, Video } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

const API_URL = import.meta.env.VITE_API_URL || '';

const resolveUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  if (url.startsWith('/uploads')) return `${API_URL}${url}`;
  return url;
};

const MediaPicker = ({ isOpen, onClose, onSelect, accept = 'image/*', title = 'Медиабиблиотека' }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const load = async () => {
    try {
      setLoading(true);
      // Пробуем разные эндпоинты
      let res;
      try {
        res = await api.get('/admin/media');
      } catch {
        try {
          res = await api.get('/media');
        } catch {
          res = { data: { data: [] } };
        }
      }
      setItems(res.data?.data || res.data?.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) load();
  }, [isOpen]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    if (file.type.startsWith('video')) {
      fd.append('video', file);
    } else {
      fd.append('image', file);
      fd.append('file', file);
    }

    try {
      setUploading(true);
      let res;
      try {
        res = await api.post('/admin/settings/upload-image', fd);
      } catch {
        try {
          res = await api.post('/upload', fd);
        } catch {
          res = await api.post('/admin/upload', fd);
        }
      }
      const url = res.data?.data?.url || res.data?.url || res.data?.path;
      if (url) {
        toast.success('Загружено');
        onSelect(url);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Ошибка загрузки');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Выбери файл или загрузить новый</p>
          <div>
            <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={handleUpload} />
            <Button size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? <Spinner size="sm" /> : <Upload size={16} />}
              {uploading ? 'Загрузка...' : 'Загрузить'}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <Image size={40} className="mx-auto mb-2" />
            <p className="text-sm">Медиа пока нет</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[420px] overflow-y-auto">
            {items.map((item, idx) => {
              const url = item.url || item.path || item.src;
              const full = resolveUrl(url);
              const isVideo = (item.type === 'video') || url?.includes('.mp4') || url?.includes('.webm');
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onSelect(url || full);
                    onClose();
                  }}
                  className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-blue-500"
                >
                  {isVideo ? (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <Video className="text-white" />
                    </div>
                  ) : (
                    <img src={full} alt="" className="w-full h-full object-cover" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default MediaPicker;
