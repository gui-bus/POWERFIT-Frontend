import Image from "next/image";

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-3">
        <Image
          src="/images/powerfit-logo.svg"
          alt="PowerFit"
          width={140}
          height={16}
          className="h-5 w-auto"
        />
        <h1 className="font-anton text-3xl text-primary italic uppercase tracking-widest leading-none">
          {title}
        </h1>
      </div>
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.4em] pl-1">
        {subtitle}
      </p>
    </div>
  );
}
