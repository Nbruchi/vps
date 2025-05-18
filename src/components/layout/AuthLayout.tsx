
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-14 flex items-center border-b px-6">
        <h1 className="font-bold text-xl">Parking Management System</h1>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
      
      <footer className="py-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Vehicle Parking Management System</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
