"use client";

import { useRef } from "react";

export default function InlineEditNumberField({
  action,
  id,
  field,
  value,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  field: string;
  value: number;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={action}>
      <input type="hidden" name="id" value={id} />
      <input
        type="number"
        name={field}
        min={0}
        step={1}
        defaultValue={value}
        onBlur={(e) => {
          if (e.target.value !== String(value)) {
            formRef.current?.requestSubmit();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            (e.target as HTMLInputElement).blur();
          }
        }}
        className="w-16 rounded border border-transparent bg-transparent px-1.5 py-1 text-sm text-zinc-700 hover:border-zinc-200 focus:border-zinc-300 focus:bg-white focus:outline-none"
      />
    </form>
  );
}
