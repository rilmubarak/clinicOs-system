import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import SortableItem from 'src/components/UI/SortableItem';
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

const initialModal = {
  type: '', 
  isActive: false
}

const AnamnesisDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [selectedAnamnesis, setSelectedAnamnesis] = useState<AnamnesisFormType>(initialAnamnesis);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(initialModal);
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await fetch(`http://localhost:5001/anamnesis/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch data.');
        }

        const data = await response.json();
        setSelectedAnamnesis(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [id]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = selectedAnamnesis.sections.findIndex(section => section.id === active.id);
      const newIndex = selectedAnamnesis.sections.findIndex(section => section.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        setSelectedAnamnesis(prevState => {
          const updatedSections = arrayMove(prevState.sections, oldIndex, newIndex);
          
          // To update the local state, push changes to the server
          updateSectionsOnServer({ ...prevState, sections: updatedSections });
          return { ...prevState, sections: updatedSections };
        });
      }
    }
  };

  const updateSectionsOnServer = async (updatedData: AnamnesisFormType) => {
    try {
      const response = await fetch(`http://localhost:5001/anamnesis/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update the form data.');
      }

      setShowModal({ type: 'success', isActive: true});
      console.log('Form data updated successfully!');
    } catch (error) {
      setError('Failed to update form data. ' + error);
      console.error('Error updating form data:', error);
    }
  };
  
  const handleDeleteSection = async () => {
    if (!sectionToDelete) return;

    try {
      const response = await fetch(`http://localhost:5001/anamnesis/${selectedAnamnesis.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sections: selectedAnamnesis.sections.filter(section => section.id !== sectionToDelete),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete the section.');
      }

      setSelectedAnamnesis(prevState => ({
        ...prevState,
        sections: prevState.sections.filter(section => section.id !== sectionToDelete),
      }));
    } catch (error) {
      console.log('error :>> ', error);
      setError('Failed to delete the section.');
    } finally {
      handleOnCloseModal()
      setSectionToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    handleOnCloseModal()
    setSectionToDelete(null);
  };

  const handleDeleteClick = (sectionId: string) => {
    setSectionToDelete(sectionId);
    setShowModal({ type: 'confirm', isActive: true});
  };

  const handleOnCloseModal = () => {
    setShowModal({ type: '', isActive: false});
    setError(null)
  }
  
  if (loading) return <Loading />;
  if (error) return <Modal type='error' message={error as string} onClose={handleOnCloseModal}/>;
  if (!selectedAnamnesis) return <p className="text-center text-gray-600">Form not found</p>;

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={selectedAnamnesis.sections.map(section => section.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4 p-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedAnamnesis.title}</h1>
              <p className="text-gray-600">{selectedAnamnesis.description}</p>
            </div>
            {selectedAnamnesis.sections.map((section) => (
              <SortableItem key={section.id} id={section.id}>
                <div className="bg-white shadow rounded-lg p-4 border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{section.title}</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {section.questions.map(question => (
                      <li key={question.id} className="text-gray-800">
                        {question.type === 'short_text' ? (
                          <strong>{question.question}</strong>
                        ) : (
                          <div>
                            <strong>{question.question}</strong>
                            {question.options && (
                              <ul className="list-disc pl-5 mt-2">
                                {question.options.map((option, index) => (
                                  <li key={index} className="text-gray-800">{option}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleDeleteClick(section.id)}
                  className="mt-4 block ml-auto bg-red-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {showModal.isActive && showModal.type == 'confirm' && sectionToDelete && (
        <Modal
          type="confirm"
          message="Are you sure you want to delete this section?"
          onClose={handleCancelDelete}
          onConfirm={handleDeleteSection}
        />
      )}

      {showModal.isActive && showModal.type == 'success' && (
        <Modal
          type='success'
          message="Section successfully updated"
          onClose={handleOnCloseModal}
        />
      )}
    </>
  );
};

export default AnamnesisDetail;
