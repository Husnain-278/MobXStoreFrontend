import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { formatErrorMessage } from '../utils/errorHandler';
import toast from 'react-hot-toast';

export default function VerifyEmailPage() {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verify = async () => {
      try {
        setStatus('verifying');
        const result = await verifyEmail(uidb64, token);
        if (result.meta.requestStatus !== 'fulfilled') {
          throw new Error(formatErrorMessage(result.payload || 'Email verification failed'));
        }
        setStatus('success');
        setMessage('Email verified successfully!');
        toast.success('Email verified! You can now login.');
        setTimeout(() => navigate('/login'), 2000);
      } catch (err) {
        const errorMessage = formatErrorMessage(err);
        setStatus('error');
        setMessage(errorMessage);
        toast.error(errorMessage);
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    if (uidb64 && token) {
      verify();
    }
  }, [uidb64, token]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Email Verification</h2>
        
        {status === 'verifying' ? (
          <div>
            <div className="inline-block mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
            <p className="text-gray-600">{message}</p>
          </div>
        ) : status === 'error' ? (
          <div>
            <p className="text-red-600 mb-4">
              {message}
            </p>
            <p className="text-gray-600 text-sm">Redirecting to login...</p>
          </div>
        ) : (
          <div>
            <p className="text-green-600 mb-4">✓ {message}</p>
            <p className="text-gray-600 text-sm">Redirecting to login...</p>
          </div>
        )}
      </div>
    </div>
  );
}
