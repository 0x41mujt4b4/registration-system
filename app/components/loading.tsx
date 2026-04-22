import { Spinner } from "@radix-ui/themes";

interface LoadingProps {
  className?: string;
}

export default function Loading({ className }: LoadingProps) {
  return (
    <span className={`flex mx-auto justify-center items-center h-96 ${className ?? ''}`}>
      <Spinner
        size="3"
        className={`text-purple-900 ${className ?? ''}`}
      />
    </span>
  );
}
