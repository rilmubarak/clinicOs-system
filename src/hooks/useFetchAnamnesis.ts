import { useState, useEffect, useMemo, useCallback } from 'react';
import { AnamnesisFormType } from 'src/types';
import useDebounce from 'src/hooks/useDebounce';

interface UseAnamnesisResult {
  data: AnamnesisFormType[];
  isLoading: boolean;
  error?: Error | string;
  deleteItem?: (id: number) => Promise<void>;
}

const API_URL = 'http://localhost:5001/anamnesis';

const useFetchAnamnesis = (searchTerm: string): UseAnamnesisResult => {
  const [data, setData] = useState<AnamnesisFormType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | string>('');

  const debouncedSearchTerm = useDebounce(searchTerm, 600);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [data, debouncedSearchTerm]);

  const deleteItem = useCallback(async (id: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      setData(prevData => prevData.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting data:', error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data: filteredData, isLoading, error, deleteItem };
};

export default useFetchAnamnesis;
