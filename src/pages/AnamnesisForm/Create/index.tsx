import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';
import Modal from 'src/components/UI/Modal';
import SortableItem from 'src/components/UI/SortableItem';
import FormHeader from 'src/components/AnamnesisForm/FormHeader';
import QuestionEditor from 'src/components/AnamnesisForm/QuestionEditor';
import QuestionTypeButtons from 'src/components/AnamnesisForm/QuestionTypeButtons';
import { reorderItems } from 'src/utils/DnDUtils';
import { useFormState } from 'src/hooks/useFormState';
import { useEffect, useState } from 'react';
import { AnamnesisFormType } from 'src/types';
import { useNavigate } from 'react-router-dom';

interface AnamnesisFormProps {
  existingFormData?: AnamnesisFormType;
}

const AnamnesisFormCreate = ({ existingFormData }: AnamnesisFormProps) => {
  const {
    formTitle,
    setFormTitle,
    formDescription,
    setFormDescription,
    sections,
    setSections,
    addSection,
    addQuestion,
    updateQuestion,
    removeQuestion,
    setIsSaving,
    isSaving,
    handleSave,
    setError,
    error
  } = useFormState(existingFormData);
  const navigate = useNavigate();

  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    setSections((currentItems) => reorderItems(currentItems, event));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDeleteSection = (id: string) => {
    setSections((currentSections) => currentSections.filter(section => section.id !== id));
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
    setError(null)

    if (isSaving) {
      setIsSaving(false);
      navigate('/');
    }
  };

  useEffect(() => {
    if (error) {
      setIsErrorModalOpen(true);
    }
  }, [error]);

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">{existingFormData? 'Update' : 'Create'} Anamnesis Form</h2>
      <FormHeader
        formTitle={formTitle}
        setFormTitle={setFormTitle}
        formDescription={formDescription}
        setFormDescription={setFormDescription}
      />
      <div className="mb-6">
        <button
          onClick={addSection}
          disabled={!formTitle}
          className={`px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            !formTitle
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-cyan-500 text-white hover:bg-cyan-700 focus:ring-indigo-500'
          }`}
        >
          Add Section
        </button>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map(section => section.id)} strategy={verticalListSortingStrategy}>
          {sections.map((section, index) => (
            <SortableItem key={section.id} id={section.id}>
              <div className="p-4 border border-gray-300 rounded-md shadow-sm bg-gray-50 w-full">
                <div className="mb-4">
                  <label htmlFor={`sectionTitle-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    id={`sectionTitle-${index}`}
                    placeholder="Section Title"
                    value={section.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setSections(sections.map(s =>
                        s.id === section.id ? { ...s, title } : s
                      ));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <QuestionTypeButtons sectionId={section.id} addQuestion={addQuestion} />
                {section.questions.map(question => (
                  <QuestionEditor
                    key={question.id}
                    question={question}
                    sectionId={section.id}
                    onUpdate={(updatedQuestion) => updateQuestion(section.id, updatedQuestion)}
                    onRemove={(sectionId, questionId) => removeQuestion(sectionId, questionId)}
                  />
                ))}
              </div>
              <button
                onClick={() => handleDeleteSection(section.id)}
                className="mt-4 block ml-auto bg-red-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
      {sections.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving || !formTitle}
            className={`px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isSaving || !formTitle
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed opacity-70'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}
      { isErrorModalOpen &&
        <Modal
          type='error'
          message={error as string}
          onClose={closeErrorModal}
        />
      }

      { isSaving &&
        <Modal
          type='success'
          message={`Data successfully ${existingFormData? 'updated' : 'created'}!`}
          onClose={closeErrorModal}
        />
      }
    </div>
  );
};

export default AnamnesisFormCreate;
