
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { UserRole } from '@/contexts/AppContext';
import { useAppContext } from '@/contexts/AppContext';
import Image from 'next/image';
import { Building, LogIn, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserRole } from '@/services/userService';

const availableRoles: Exclude<UserRole, null>[] = ['admin', 'teacher', 'student', 'parent'];

export default function RoleSelectorClient() {
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoadingAuthAction, setIsLoadingAuthAction] = useState(false);

  const router = useRouter();
  const { authUser, role, setRole, isLoadingUser } = useAppContext();
  const { toast } = useToast();

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing Fields",
        description: "Please enter both email and password.",
      });
      return;
    }
    if (!selectedRole) {
      toast({
        variant: "destructive",
        title: "Role Selection Required",
        description: "Please select your role to sign in.",
      });
      return;
    }

    setIsLoadingAuthAction(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      if (firebaseUser) {
        const actualRoleFromFirestore = await getUserRole(firebaseUser.uid);

        if (!actualRoleFromFirestore) {
          toast({
            variant: "destructive",
            title: "Sign In Failed",
            description: "Account role not found or not configured. Please contact an administrator.",
          });
          // Optionally, sign out the user here if Firebase auth succeeded but Firestore setup is missing
          // await auth.signOut(); 
        } else if (actualRoleFromFirestore === selectedRole) {
          setRole(actualRoleFromFirestore); 
          toast({
            title: "Signed In Successfully",
            description: `Welcome, ${actualRoleFromFirestore}! Redirecting to dashboard...`,
          });
          router.push('/dashboard');
        } else {
          toast({
            variant: "destructive",
            title: "Sign In Failed",
            description: "Incorrect role selected for this account. Please verify your role and try again.",
          });
           // Optionally, sign out the user here as well to prevent session confusion
          // await auth.signOut();
        }
      } else {
         toast({ variant: "destructive", title: "Sign In Failed", description: "Could not retrieve user details after sign in." });
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      let errorMessage = "An unexpected error occurred.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password. Please try again.";
      } else {
        errorMessage = error.message || errorMessage;
      }
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoadingAuthAction(false);
    }
  };
  
  useEffect(() => {
    if (!isLoadingUser && authUser && role) {
      router.push('/dashboard');
    }
  }, [isLoadingUser, authUser, role, router]);


  if (isLoadingUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-primary/10 p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading user session...</p>
      </div>
    );
  }
  
  // If user is authenticated AND has a role, the useEffect above should redirect.
  // This form shows if user is not authenticated, or (in rare cases) authenticated but role fetch failed.
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
            <Building size={40} />
          </div>
          <CardTitle className="font-headline text-3xl font-bold text-primary">
            Welcome to EduCentral
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to access your dashboard.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSignIn}>
          <CardContent className="space-y-6">
            <Image
              src="https://placehold.co/600x300.png"
              alt="School illustration"
              width={600}
              height={300}
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
            <div className="space-y-2">
                <Label htmlFor="selectedRole">Select Your Role</Label>
                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)} disabled={isLoadingAuthAction}>
                  <SelectTrigger id="selectedRole" className="w-full">
                    <SelectValue placeholder="Choose your role" />
                  </SelectTrigger>
                  <SelectContent>
                      {availableRoles.map(r => r && <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}
                  </SelectContent>
                </Select>
            </div>
            <Button type="submit" disabled={isLoadingAuthAction || !selectedRole} className="w-full text-lg py-6 bg-accent hover:bg-accent/90 text-accent-foreground">
              {isLoadingAuthAction ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
              {isLoadingAuthAction ? 'Signing In...' : 'Sign In'}
            </Button>
          </CardContent>
          <CardFooter className="text-center text-xs text-muted-foreground pt-4">
            If you have trouble signing in, please contact your administrator.
          </CardFooter>
        </form>
      </Card>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        EduCentral &copy; {new Date().getFullYear()}. Your integrated school management solution.
      </p>
    </div>
  );
}
