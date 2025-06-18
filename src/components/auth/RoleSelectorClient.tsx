
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { UserRole } from '@/contexts/AppContext';
import { useAppContext } from '@/contexts/AppContext';
import Image from 'next/image';
import { Building, LogIn, UserPlus, ShieldCheck, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function RoleSelectorClient() {
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoadingAuthAction, setIsLoadingAuthAction] = useState(false); // For login/signup button
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const router = useRouter();
  const { authUser, setRole, isLoadingUser } = useAppContext();
  const { toast } = useToast();

  const handleProceedWithRole = () => {
    if (selectedRole && authUser) {
      setRole(selectedRole as UserRole);
      router.push('/dashboard');
    } else if (!authUser) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in or sign up first.",
      });
    } else if (!selectedRole) {
       toast({
        variant: "destructive",
        title: "Role Selection Required",
        description: "Please select a role to continue.",
      });
    }
  };

  const handleAuthAction = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please enter both email and password.",
      });
      return;
    }
    setIsLoadingAuthAction(true);
    try {
      if (isSignUpMode) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({
          title: "Account Created",
          description: "You've successfully signed up! Please select your role if prompted.",
        });
        // AppContext.onAuthStateChanged handles setting authUser.
        // User might be redirected or stay to select role.
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Signed In",
          description: "Successfully signed in!",
        });
        // AppContext.onAuthStateChanged handles setting authUser.
        // If role exists in localStorage, AuthenticatedLayout handles redirect.
        // Otherwise, user stays on this page to select role (since authUser is now set).
      }
    } catch (error: any) {
      console.error(`${isSignUpMode ? "Sign up" : "Sign in"} error:`, error);
      toast({
        variant: "destructive",
        title: `${isSignUpMode ? "Sign Up" : "Sign In"} Failed`,
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoadingAuthAction(false);
    }
  };
  
  if (isLoadingUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-primary/10 p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading user session...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-primary/10 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            { authUser ? <ShieldCheck size={40} /> : <Building size={40} /> }
          </div>
          <CardTitle className="font-headline text-3xl font-bold text-primary">
            {authUser ? "Select Your Role" : "Welcome to EduCentral"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {authUser ? "You're signed in. Please select your role to proceed." : (isSignUpMode ? "Create an account to get started." : "Sign in to access your dashboard.")}
          </CardDescription>
        </CardHeader>
        
        {!authUser ? (
          <form onSubmit={handleAuthAction}>
            <CardContent className="space-y-6">
              <Image
                src="https://placehold.co/600x400.png"
                alt="School illustration"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg object-cover"
                data-ai-hint="school education"
              />
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  disabled={isLoadingAuthAction}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  disabled={isLoadingAuthAction}
                />
              </div>
              <Button type="submit" disabled={isLoadingAuthAction} className="w-full text-lg py-6 bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoadingAuthAction ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (isSignUpMode ? <UserPlus className="mr-2 h-5 w-5" /> : <LogIn className="mr-2 h-5 w-5" />)}
                {isLoadingAuthAction ? 'Processing...' : (isSignUpMode ? 'Sign Up' : 'Sign In')}
              </Button>
              <Button 
                type="button" 
                variant="link" 
                onClick={() => setIsSignUpMode(!isSignUpMode)} 
                disabled={isLoadingAuthAction}
                className="w-full"
              >
                {isSignUpMode ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </Button>
            </CardContent>
            <CardFooter className="text-center text-xs text-muted-foreground pt-4">
              By signing in or signing up, you agree to our Terms of Service.
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-6">
             <Image
                src="https://placehold.co/600x400.png"
                alt="Role selection illustration"
                width={600}
                height={400}
                className="w-full h-auto rounded-lg object-cover"
                data-ai-hint="team choice"
              />
            <Select value={selectedRole || ''} onValueChange={(value) => setSelectedRole(value as UserRole) }>
              <SelectTrigger className="w-full text-base">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleProceedWithRole} disabled={!selectedRole || isLoadingAuthAction} className="w-full text-lg py-6 bg-accent hover:bg-accent/90 text-accent-foreground">
              {isLoadingAuthAction ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              Proceed to Dashboard
            </Button>
          </CardContent>
        )}
      </Card>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        EduCentral &copy; {new Date().getFullYear()}. Your integrated school management solution.
      </p>
    </div>
  );
}
