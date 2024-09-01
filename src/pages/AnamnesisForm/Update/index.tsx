import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AnamnesisForm from 'src/pages/AnamnesisForm/Create';
import { AnamnesisFormType } from 'src/types';
import Modal from 'src/components/UI/Modal';
import Loading from 'src/components/UI/Loading';

const initialAnamnesis: AnamnesisFormType = {
  id: 0,
  title: '',
  description: '',
  createdAt: '',
  sections: [],
};

const AnamnesisFormUpdate = () => {
  const { id } = useParams();

  const [formData, setFormData] = useState<AnamnesisFormType>(initialAnamnesis);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/anamnesis/${id}`);
        const data = await response.json();
        setFormData(data);
        setLoading(false);
      } catch (err) {
        console.log('err :>> ', err);
        setError('Failed to load form data', );
        setLoading(false);
      }
    };

    loadFormData();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <Modal type='error' message={error as string} onClose={() => setError('')}/>;

  return (
    <AnamnesisForm existingFormData={formData} />
  );
};

export default AnamnesisFormUpdate;
