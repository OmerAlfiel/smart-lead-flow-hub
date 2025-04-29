
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const SignupForm: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // This is where Firebase authentication would happen
      // For now, we'll use mock data
      console.log('Sign up attempt with:', { fullName, email, password });
      
      // Mock successful signup
      setTimeout(() => {
        toast({
          title: "Account created!",
          description: "Your account has been created successfully.",
        });
        setIsLoading(false);
        // Here we would redirect to dashboard
      }, 1500);
      
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Sign up failed",
        description: "There was an error creating your account.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <div className="mt-1">
          <Input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="block w-full"
          />
        </div>
      </div>

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
        <Label htmlFor="password">Password</Label>
        <div className="mt-1">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="mt-1">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          {isLoading ? 'Creating account...' : 'Sign up'}
        </Button>
      </div>
    </form>
  );
};

export default SignupForm;
