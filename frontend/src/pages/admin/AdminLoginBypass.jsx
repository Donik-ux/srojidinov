import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { devLogin } from '../../features/auth/authSlice';

const AdminLoginBypass = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('devAdmin', 'true');
    dispatch(devLogin());
    navigate('/admin', { replace: true });
  }, [dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-600">Вход в админку...</p>
    </div>
  );
};

export default AdminLoginBypass;
