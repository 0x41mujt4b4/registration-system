import { Spinner } from "@radix-ui/themes";

export default function Loading() {
  return (
    <span className="flex h-96 items-center justify-center">
      <Spinner size="3" className="text-purple-900" />
    </span>
  );
}
