import { Spinner } from "@radix-ui/themes";

export default function Loading() {
  return (
    <span className="fixed mx-auto justify-center items-center h-screen text-blue-200">
      <Spinner
        size="3"
        className="text-blue-200"
      />
    </span>
  );
}
