
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { UserRole } from '@/contexts/AppContext';
import { useAppContext } from '@/contexts/AppContext';
import Image from 'next/image';
import { Building, LogIn, UserPlus, ShieldCheck, Loader2, UserCog } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { setUserRole as saveUserRoleToFirestore } from '@/services/userService';

const availableRoles: UserRole[] = ['admin', 'teacher', 'student', 'parent'];

export default function RoleSelectorClient() {
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>(''); // For post-auth role selection
  const [signUpRole, setSignUpRole] = useState<UserRole | ''>(''); // For role selection during sign-up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoadingAuthAction, setIsLoadingAuthAction] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const router = useRouter();
  const { authUser, role, setRole, isLoadingUser } = useAppContext();
  const { toast } = useToast();

  const handleProceedWithRole = () => {
    if (selectedRole && authUser) {
      setRole(selectedRole as UserRole); // AppContext handles saving to Firestore
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

    if (isSignUpMode && !signUpRole) {
      toast({
        variant: "destructive",
        title: "Role Required for Sign Up",
        description: "Please select a role to create your account.",
      });
      return;
    }

    setIsLoadingAuthAction(true);
    try {
      if (isSignUpMode) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;
        await saveUserRoleToFirestore(newUser.uid, newUser.email, signUpRole as UserRole);
        // setRole(signUpRole as UserRole); // AppContext's onAuthStateChanged will pick up the role from Firestore
        toast({
          title: "Account Created",
          description: "You've successfully signed up! Redirecting to dashboard...",
        });
        router.push('/dashboard'); 
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
          title: "Signed In",
          description: "Successfully signed in!",
        });
        // AppContext.onAuthStateChanged handles setting authUser.
        // If role exists in Firestore, AuthenticatedLayout handles redirect via AppContext.
        // Otherwise, user stays on this page (authUser is set, role is null) for role selection.
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

  // If user is authenticated AND has a role, AuthenticatedLayout should redirect.
  // This component should only show content if user is not auth'd, or auth'd but no role.
  if (authUser && role) {
     return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-primary/10 p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-primary/10 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            { authUser ? <UserCog size={40} /> : <Building size={40} /> }
          </div>
          <CardTitle className="font-headline text-3xl font-bold text-primary">
            {authUser && !role ? "Select Your Role" : (isSignUpMode ? "Create Your EduCentral Account" : "Welcome to EduCentral")}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {authUser && !role ? "Please select your role to proceed to the dashboard." : (isSignUpMode ? "Fill in your details and choose your role." : "Sign in to access your dashboard.")}
          </CardDescription>
        </CardHeader>
        
        {authUser && !role ? ( // Authenticated but no role set (e.g. existing user, sign-in without prior role)
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
                {availableRoles.map(r => r && <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button onClick={handleProceedWithRole} disabled={!selectedRole || isLoadingAuthAction} className="w-full text-lg py-6 bg-accent hover:bg-accent/90 text-accent-foreground">
              {isLoadingAuthAction ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              Proceed to Dashboard
            </Button>
          </CardContent>
        ) : ( // Not authenticated - show Sign In / Sign Up form
          <form onSubmit={handleAuthAction}>
            <CardContent className="space-y-6">
              <Image
                src="https://placehold.co/600x400.png"
                alt={isSignUpMode ? "School sign up" : "School illustration"}
                width={600}
                height={400}
                className="w-full h-auto rounded-lg object-cover"
                data-ai-hint={isSignUpMode ? "education form" : "school education"}
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
              {isSignUpMode && (
                <div className="space-y-2">
                  <Label htmlFor="signUpRole">Select Your Role</Label>
                  <Select value={signUpRole} onValueChange={(value) => setSignUpRole(value as UserRole)} disabled={isLoadingAuthAction}>
                    <SelectTrigger id="signUpRole" className="w-full">
                      <SelectValue placeholder="Choose your role" />
                    </SelectTrigger>
                    <SelectContent>
                       {availableRoles.map(r => r && <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
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
        )}
      </Card>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        EduCentral &copy; {new Date().getFullYear()}. Your integrated school management solution.
      </p>
    </div>
  );
}

