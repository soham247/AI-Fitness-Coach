'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Zap, Target, ArrowRight, Activity, TrendingUp } from 'lucide-react';
import { FeatureCard } from '@/components/landing-page/FeatureCard';
import { StepCard } from '@/components/landing-page/StepCard';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 text-sm font-medium mb-4">
            <Activity className="w-4 h-4" />
            AI-Powered Fitness Coaching
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight lg:mt-2">
            Your Personal AI
            <span className="block mt-2">Fitness Coach</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Get personalized workout and diet plans powered by artificial intelligence. 
            Tailored to your goals, fitness level, and preferences.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-">
            <Button
              onClick={() => router.push('/generate-plan')}
              size="lg"
              className="text-lg px-8 py-4 h-auto"
            >
              Try Now - It's Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4 h-auto"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20">
          <FeatureCard
            icon={<Dumbbell className="w-10 h-10" />}
            title="Custom Workouts"
            description="Exercises tailored to your fitness level and available equipment"
          />
          <FeatureCard
            icon={<Target className="w-10 h-10" />}
            title="Nutrition Plans"
            description="Personalized meal plans with complete macro breakdowns"
          />
          <FeatureCard
            icon={<Zap className="w-10 h-10" />}
            title="AI-Powered"
            description="Smart recommendations that adapt to your progress"
          />
          <FeatureCard
            icon={<TrendingUp className="w-10 h-10" />}
            title="Track Progress"
            description="Monitor your fitness journey and celebrate milestones"
          />
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              number="1" 
              title="Enter Your Details" 
              description="Share your fitness goals, current level, and dietary preferences"
            />
            <StepCard 
              number="2" 
              title="AI Generates Plan" 
              description="Our AI creates a personalized workout and nutrition strategy"
            />
            <StepCard 
              number="3" 
              title="Start Your Journey" 
              description="Follow your custom plan and track your progress"
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl">Ready to Transform?</CardTitle>
              <CardDescription className="text-base">
                Join thousands of users achieving their fitness goals with AI-powered coaching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => router.push('/generate-plan')}
                size="lg"
                className="w-full sm:w-auto"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}