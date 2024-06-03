import { Spinner } from "@radix-ui/themes";

export default function Loading() {
  return (
    <span className="fixed mx-auto justify-center items-center h-screen text-purple-900">
      <Spinner
        size="3"
        className="text-purple-900"
      />
    </span>
  );
}
