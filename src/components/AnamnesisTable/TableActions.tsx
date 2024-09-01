import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnamnesisFormType } from 'src/types';
import useFetchAnamnesis from 'src/hooks/useFetchAnamnesis';
import Modal from 'src/components/UI/Modal';

interface TableActionsProps {
  original: AnamnesisFormType;
}

const TableActions = ({ original }: TableActionsProps) => {
  const navigate = useNavigate();
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const { deleteItem } = useFetchAnamnesis('');

  const handleDelete = async () => {
    if (deleteItem) {
      try {
        await deleteItem(original.id);
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    } else {
      console.warn('deleteItem function is not available');
    }
    setShowConfirmModal(false);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="flex space-x-2">
      <button onClick={() => navigate(`/detail/${original.id}`)} className="text-blue-600 hover:text-blue-800">View</button>
      <button onClick={() => navigate(`/update/${original.id}`)} className="text-green-600 hover:text-green-800">Edit</button>
      <div>
        <button onClick={() => setShowConfirmModal(true)} className="text-red-600 hover:text-red-800">
          Delete
        </button>
        
        {showConfirmModal && (
          <Modal
            type='confirm'
            message="Are you sure you want to delete this item?"
            onConfirm={handleDelete}
            onClose={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default TableActions;
