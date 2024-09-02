import useAnamnesisForm from 'src/hooks/useAnamnesisForm';
import AnamnesisForm from 'src/pages/AnamnesisForm/Create';
import Loading from 'src/components/UI/Loading';
import Modal from 'src/components/UI/Modal';

const AnamnesisFormUpdate = () => {
  const {
    selectedAnamnesis,
    isLoading,
    handleOnCloseModal,
    error
  } = useAnamnesisForm();

  if (isLoading) return <Loading />;
  if (error) return <Modal type='error' message={error} onClose={handleOnCloseModal}/>;

  return (
    <AnamnesisForm existingFormData={selectedAnamnesis} />
  );
};

export default AnamnesisFormUpdate;
