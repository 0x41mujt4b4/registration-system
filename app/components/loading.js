import { Spinner } from "@radix-ui/themes";

export default function Loading() {
  return (
    <span className="fixed mx-auto justify-center items-center h-screen text-sky-200">
      <Spinner
        size="3"
        className="text-sky-200"
      />
    </span>
  );
}
