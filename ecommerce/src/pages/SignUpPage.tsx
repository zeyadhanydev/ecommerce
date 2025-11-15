import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { signUp, loading } = useAuth();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);
    const { error: signUpError } = await signUp({ email, password, firstName, lastName });
    if (!signUpError) {
      setIsSuccess(true);
    }
  };

  return (
    <div className="container mx-auto px-6 py-20 flex justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 shadow-md rounded-lg">
          <h1 className="font-heading text-3xl text-center mb-6">Create Account</h1>
          {isSuccess ? (
            <div className="text-center text-green-700 bg-green-50 p-4 rounded-md">
              <p className="font-semibold">Success!</p>
              <p className="text-sm">Please check your email to confirm your account.</p>
              <Button asChild to="/login" className="mt-4">Go to Login</Button>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" >First Name</label>
                    <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full px-4 py-3 border border-brand-gray rounded-md" />
                  </div>
                  <div>
                    <label htmlFor="lastName" >Last Name</label>
                    <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="w-full px-4 py-3 border border-brand-gray rounded-md" />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" >Email Address</label>
                  <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 border border-brand-gray rounded-md"/>
                </div>
                <div>
                  <label htmlFor="password" >Password</label>
                  <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 border border-brand-gray rounded-md"/>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </form>
              <p className="text-center text-sm text-brand-black/70 mt-4">
                  Already have an account? <Link to="/login" className="text-brand-yellow underline">Log in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
