import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import useAnamnesisForm from 'src/hooks/useAnamnesisForm';
import SortableItem from 'src/components/UI/SortableItem';
import Loading from 'src/components/UI/Loading';
import Modal from 'src/components/UI/Modal';

const AnamnesisDetail = () => {
  const {
    selectedAnamnesis,
    isLoading,
    error,
    showModal,
    sectionToDelete,
    DnDsensors,
    handleDeleteSectionDetail,
    handleDragEndDetail,
    handleCancelDelete,
    handleOnCloseModal,
    handleDeleteClick,
  } = useAnamnesisForm();

  if (isLoading) return <Loading />;
  if (error) return <Modal type='error' message={error} onClose={handleOnCloseModal}/>;
  if (!selectedAnamnesis) return <p className="text-center text-gray-600">Anamnesis not found</p>;

  return (
    <>
      <DndContext sensors={DnDsensors} collisionDetection={closestCenter} onDragEnd={handleDragEndDetail}>
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
          onConfirm={handleDeleteSectionDetail}
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
