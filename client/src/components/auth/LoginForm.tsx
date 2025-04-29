
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // This is where Firebase authentication would happen
      // For now, we'll use mock data
      console.log('Login attempt with:', { email, password });
      
      // Mock successful login
      setTimeout(() => {
        toast({
          title: "Success!",
          description: "You've been logged in successfully.",
        });
        setIsLoading(false);
        // Here we would redirect to dashboard
      }, 1500);
      
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="email">Email address</Label>
        <div className="mt-1">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <div className="text-sm">
            <Link to="/reset-password" className="font-medium text-brand-600 hover:text-brand-500">
              Forgot your password?
            </Link>
          </div>
        </div>
        <div className="mt-1">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full"
          />
        </div>
      </div>

      <div>
        <Button 
          type="submit" 
          className="w-full bg-brand-600 hover:bg-brand-700"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Log in'}
        </Button>
      </div>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3">
          <div>
            <Button 
              type="button" 
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              variant="outline"
              onClick={() => {
                toast({
                  title: "Google sign-in",
                  description: "This feature will be available when Firebase is integrated.",
                });
              }}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.226,1.734-1.043,3.239-2.301,4.3
                c-1.258,1.061-2.886,1.640-4.572,1.64c-3.988,0-7.227-3.239-7.227-7.227s3.239-7.227,7.227-7.227c1.909,0,3.641,0.75,4.924,1.967
                l1.346-1.346C15.5,4.447,13.368,3.469,11.118,3.469c-4.988,0-9.027,4.039-9.027,9.027s4.039,9.027,9.027,9.027
                c2.385,0,4.57-0.923,6.201-2.554c1.631-1.631,2.554-3.816,2.554-6.201c0-0.451-0.037-0.9-0.11-1.34h-8.627v2.725H12.545z" />
              </svg>
              <span>Google</span>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
