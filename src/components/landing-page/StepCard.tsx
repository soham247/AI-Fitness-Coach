export function StepCard({ number, title, description }: { 
  number: string; 
  title: string; 
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}