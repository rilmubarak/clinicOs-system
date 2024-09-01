import SearchIcon from 'src/icons/SearchIcon';

interface SearchInputProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

const SearchInput = ({ searchTerm, onSearchTermChange }: SearchInputProps) => {
  return (
    <div className="relative flex-1 mr-4">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
        className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
        <SearchIcon />
      </span>
    </div>
  );
};

export default SearchInput;
