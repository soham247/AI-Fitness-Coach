'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { Dumbbell } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const isGeneratePlan = pathname === '/generate-plan';

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-sm font-semibold hover:opacity-80"
          >
            <Dumbbell className="h-5 w-5 text-primary" />
            <span>Fitness AI</span>
          </button>
        </div>

        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Home
          </Link>
          <Link
            href="/generate-plan"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isGeneratePlan ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Generate Plan
          </Link>

          <div className="ml-2 flex items-center gap-2">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
