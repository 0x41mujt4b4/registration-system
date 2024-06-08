import { Spinner } from "@radix-ui/themes";

export default function Loading({className}) {
  return (
    <span className={`flex mx-auto justify-center items-center h-96 ${className}`}>
      <Spinner
        size="3"
        className={`text-purple-900 ${className}`}
      />
    </span>
  );
}
