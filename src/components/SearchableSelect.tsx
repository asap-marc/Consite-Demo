'use client';

import Select from 'react-select';

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: { value: string; label: string }[];
  value: { value: string; label: string } | null;
  onChange: (newValue: { value: string; label: string } | null) => void;
  placeholder: string;
}) {
  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isClearable
      classNames={{
        control: () =>
          '!bg-background !border-gray-300 shadow-sm',
        input: () => '!text-foreground',
        singleValue: () => '!text-foreground',
        menu: () => 'bg-background border border-gray-300 rounded-md shadow-lg',
        option: ({ isFocused }) =>
          isFocused
            ? 'bg-indigo-500 text-white'
            : 'hover:bg-indigo-100',
      }}
    />
  );
}
