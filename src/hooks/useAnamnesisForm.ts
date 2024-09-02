import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { Section, Question, AnamnesisFormType } from 'src/types';
import { reorderItems } from 'src/utils/DnDUtils';

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

// Custom hook for managing anamnesis form state and functionality
const useAnamnesisForm = (existingFormData?: AnamnesisFormType) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formTitle, setFormTitle] = useState(existingFormData ? existingFormData.title : '');
  const [sections, setSections] = useState<Section[]>(existingFormData ? existingFormData.sections : []);
  const [formDescription, setFormDescription] = useState(existingFormData ? existingFormData.description : '');
  const [selectedAnamnesis, setSelectedAnamnesis] = useState<AnamnesisFormType>(initialAnamnesis);
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(initialModal);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFormData = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5001/anamnesis/${id}`);
      const data = await response.json();

      setSelectedAnamnesis(data);
    } catch (err) {
      setError(err as string);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchFormData();
  }, [id, fetchFormData]);

  useEffect(() => {
    if (error) setShowModal({ type: 'error', isActive: true});
  }, [error]);

  // Validation form data
  const validateForm = () => {
    if (!formTitle.trim()) return 'Form title is required.';
    if (!formDescription.trim()) return 'Form description is required.';
    if (sections.length === 0) return 'At least one section is required.';

    for (const section of sections) {
      if (!section.title.trim()) return 'Section must have a title.';
      if (section.questions.length === 0) return 'Section must have at least one question.';
      
      for (const question of section.questions) {
        if (['short_text', 'long_text'].includes(question.type) && !question.question.trim()) {
          return 'Question cannot be empty.';
        }
      }
    }
    
    return null;
  };

  // Save or update anamnesis form data
  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) return setError(validationError);

    setIsSaving(true);
    setError(null);

    try {
      const ID = existingFormData?.id;
      const method = ID ? 'PUT' : 'POST';
      const url = ID ? `http://localhost:5001/anamnesis/${ID}` : 'http://localhost:5001/anamnesis';

      const body = JSON.stringify({
        id: ID || Date.now(),
        title: formTitle,
        description: formDescription,
        sections: sections,
        createdAt: existingFormData?.createdAt || new Date().toISOString(),
      });

      const headers = { 'Content-Type': 'application/json' };
      await fetch(url, { method, headers, body });

      setShowModal({ type: 'success', isActive: true});
    } catch (err) {
      setError(err as string);
    }
  };

  // Delete a section for anamnesis detail
  const handleDeleteSectionDetail = async () => {
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
    } catch (err) {
      setError(err as string);
    } finally {
      handleOnCloseModal()
      setSectionToDelete(null);
    }
  };

  // Update sections on the server
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
    } catch (err) {
      setError(err as string);
    }
  };

  // Add a new section to the form
  const addSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: '',
      questions: []
    };
    setSections([...sections, newSection]);
  };

  // Add a new question to a specific section
  const addQuestion = (sectionId: string, type: Question['type']) => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      type,
      question: '',
      options: []
    };
    setSections(sections.map(section =>
      section.id === sectionId ? { ...section, questions: [...section.questions, newQuestion] } : section
    ));
  };

  // Update an existing question in a section
  const updateQuestion = (sectionId: string, updatedQuestion: Question) => {
    setSections(sections.map(section =>
      section.id === sectionId ? {
        ...section,
        questions: section.questions.map(question =>
          question.id === updatedQuestion.id ? updatedQuestion : question
        )
      } : section
    ));
  };

  // Remove a question from a section
  const removeQuestion = (sectionId: string, questionId: string) => {
    setSections(sections.map(section =>
      section.id === sectionId ? {
        ...section,
        questions: section.questions.filter(question => question.id !== questionId)
      } : section
    ));
  };

  // Remove a section from the form
  const handleDeleteSection = (id: string) => {
    setSections((currentSections) => currentSections.filter(section => section.id !== id));
  };

  // Handle the end of a drag event to reorder items
  const handleDragEnd = (event: DragEndEvent) => {
    setSections((currentItems) => reorderItems(currentItems, event));
  };

  // Handle drag end for reordering sections and update server (automatically save)
  const handleDragEndDetail = (event: DragEndEvent) => {
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

  // Set up drag-and-drop sensors
  const DnDsensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Close the modal dialog and handle navigation if saving
  const handleOnCloseModal = () => {
    setShowModal({ type: '', isActive: false});
    setError(null)

    if (isSaving && !error) {
      navigate('/');
    }

    setIsSaving(false);
  };

  // Show confirmation modal for section deletion
  const handleDeleteClick = (sectionId: string) => {
    setSectionToDelete(sectionId);
    setShowModal({ type: 'confirm', isActive: true});
  };

  // Cancel the deletion of a section
  const handleCancelDelete = () => {
    handleOnCloseModal()
    setSectionToDelete(null);
  };

  return {
    // Form state and handlers
    formTitle,
    setFormTitle,
    formDescription,
    setFormDescription,
    sections,
    setSections,
    selectedAnamnesis,

    // Loading and saving states
    isLoading,
    isSaving,
    error,

    // Modal state and handlers
    showModal,
    sectionToDelete,
    handleOnCloseModal,
    handleCancelDelete,
    handleDeleteClick,

    // Section and question management
    addSection,
    addQuestion,
    removeQuestion,
    updateQuestion,
    handleDeleteSection,
    handleDeleteSectionDetail,

    // Drag-and-drop handlers
    DnDsensors,
    handleDragEnd,
    handleDragEndDetail,

    // Save handler
    handleSave,

    // Server updates
    updateSectionsOnServer
  };
};

export default useAnamnesisForm;