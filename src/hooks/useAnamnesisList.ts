import { useState, useEffect, useMemo, useCallback } from 'react';
import { AnamnesisFormType } from 'src/types';
import useDebounce from 'src/hooks/useDebounce';

interface UseAnamnesisResult {
  data: AnamnesisFormType[];
  isLoading: boolean;
  error?: string | null;
  searchTerm: string, 
  setSearchTerm: (val: string) => void;
  deleteItem?: (val: number) => Promise<void>;
}

const API_URL = 'http://localhost:5001/anamnesis';

// Custom hook to manage anamnesis list
const useAnamnesisList = (): UseAnamnesisResult => {
  const [data, setData] = useState<AnamnesisFormType[]>([]);
  const [error, setError] = useState<string | null>('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err as string);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debounce the search term to limit API calls or filtering operations
  const debouncedSearchTerm = useDebounce(searchTerm, 600);

  // Filter the data based on the debounced search term
  const filteredData = useMemo(() => {
    const lowercasedSearchTerm = debouncedSearchTerm.toLowerCase();

    return data.filter(({ title, description }) =>
      title.toLowerCase().includes(lowercasedSearchTerm) ||
      description.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [data, debouncedSearchTerm]);

  // Function to delete an item by ID
  const deleteItem = useCallback(async (id: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      setData(prevData => prevData.filter(item => item.id !== id));
    } catch (err) {
      setError(err as string);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data: filteredData, isLoading, error, deleteItem, searchTerm, setSearchTerm };
};

export default useAnamnesisList;