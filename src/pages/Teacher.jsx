import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from '../supabaseClient';
import SEO from '../components/SEO/SEO';
import './Teacher.css';

const Teacher = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      }
    };
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <>
      <SEO
        title="Trang Giáo Viên - Học Đàn Tranh"
        description="Trang quản lý dành cho giáo viên"
      />
      <div className="teacher-page">
        <div className="teacher-container">
          <h1 className="teacher-title">Trang Giáo Viên</h1>
          <p className="teacher-subtitle">Chào mừng bạn đến với trang quản lý</p>
        </div>
      </div>
    </>
  );
};

export default Teacher;
