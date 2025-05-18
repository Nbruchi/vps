
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
}

const SearchInput = ({ placeholder, value, onChange, onSearch }: SearchInputProps) => {
  const [localValue, setLocalValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onChange(localValue);
      onSearch(localValue);
    }
  };

  const handleSearch = () => {
    onChange(localValue);
    onSearch(localValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    onSearch('');
  };

  return (
    <div className="relative flex w-full max-w-sm items-center">
      <Input
        type="search"
        placeholder={placeholder || "Search..."}
        className="w-full pr-12"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {localValue && (
        <Button
          variant="ghost"
          type="button"
          className="absolute right-10 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
          onClick={handleClear}
        >
          ✕
        </Button>
      )}
      <Button
        type="button"
        variant="ghost"
        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
        onClick={handleSearch}
      >
        🔍
      </Button>
    </div>
  );
};

export default SearchInput;
