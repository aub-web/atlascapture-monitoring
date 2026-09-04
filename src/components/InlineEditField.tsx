"use client";

import { useRef } from "react";

export default function InlineEditField({
  action,
  id,
  field,
  value,
  placeholder,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  field: string;
  value: string | null;
  placeholder?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={action}>
      <input type="hidden" name="id" value={id} />
      <input
        type="text"
        name={field}
        defaultValue={value ?? ""}
        placeholder={placeholder}
        onBlur={(e) => {
          if (e.target.value !== (value ?? "")) {
            formRef.current?.requestSubmit();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            (e.target as HTMLInputElement).blur();
          }
        }}
        className="w-full min-w-[140px] rounded border border-transparent bg-transparent px-1.5 py-1 text-sm text-zinc-700 hover:border-zinc-200 focus:border-zinc-300 focus:bg-white focus:outline-none"
      />
    </form>
  );
}
