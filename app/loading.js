import { Spinner } from "@radix-ui/themes";

export default function Loading() {
  return (
    <span className="flex mx-auto justify-center items-center h-96 text-blue-200">
      <Spinner
        size="3"
        className="flex items-center text-blue-200"
      />
    </span>
  );
}
