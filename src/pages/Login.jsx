import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Button from '../components/UI/Button';
import SEO from '../components/SEO/SEO';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/teacher', { replace: true });
      }
    };
    checkSession();
  }, [navigate]);

  const validateForm = () => {
    if (!email.trim()) {
      setError('Vui lòng nhập email');
      return false;
    }
    if (!email.includes('@')) {
      setError('Email không hợp lệ');
      return false;
    }
    if (!password) {
      setError('Vui lòng nhập mật khẩu');
      return false;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        setError(authError.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
        setLoading(false);
        return;
      }

      if (data?.user) {
        // Navigate directly without delay for faster redirect
        navigate('/teacher', { replace: true });
      } else {
        setError('Đăng nhập thất bại. Vui lòng thử lại.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Đăng nhập - Học Đàn Tranh"
        description="Đăng nhập vào hệ thống quản lý"
      />
      <div className="login-page">
        <div className="login-container">
          <div className="login-card">
            <h1 className="login-title">Đăng Nhập</h1>
            <p className="login-subtitle">Vui lòng đăng nhập để tiếp tục</p>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn"
                  disabled={loading}
                  className="form-input"
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Mật khẩu</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  disabled={loading}
                  className="form-input"
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="login-button"
                disabled={loading}
              >
                {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
