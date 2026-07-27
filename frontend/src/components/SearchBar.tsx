interface searchBarProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar = ({
  search,
  setSearch
}: searchBarProps
) => {
return (
        <input
            type="text"
            placeholder="Search Products"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    );
};

export default SearchBar;
