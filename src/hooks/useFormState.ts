import { useState } from 'react';
import { Section, Question, AnamnesisFormType } from 'src/types';

export const useFormState = (existingFormData?: AnamnesisFormType) => {

  const [formTitle, setFormTitle] = useState(existingFormData ? existingFormData.title : '');
  const [formDescription, setFormDescription] = useState(existingFormData ? existingFormData.description : '');
  const [sections, setSections] = useState<Section[]>(existingFormData ? existingFormData.sections : []);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: '',
      questions: []
    };
    setSections([...sections, newSection]);
  };

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

  const removeQuestion = (sectionId: string, questionId: string) => {
    setSections(sections.map(section =>
      section.id === sectionId ? {
        ...section,
        questions: section.questions.filter(question => question.id !== questionId)
      } : section
    ));
  };

  // Validation functions
  const validateForm = () => {
    if (!formTitle.trim()) {
      return 'Form title is required.';
    }
    if (!formDescription.trim()) {
      return 'Form description is required.';
    }
    if (sections.length === 0) {
      return 'At least one section is required.';
    }
    for (const section of sections) {
      if (!section.title.trim()) {
        return `Section must have a title.`;
      }
      if (section.questions.length === 0) {
        return `Section must have at least one question.`;
      }
      for (const question of section.questions) {
        if (question.type === 'short_text' && (question.question as string).trim() === '') {
          return `Question cannot be empty.`;
        }
        if (question.type === 'long_text' && (question.question as string).trim() === '') {
          return `Question cannot be empty.`;
        }
      }
    }
    return null;
  };

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

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
    } catch (err) {
      setError('Failed to save data.');
      console.error(err);
    }
  };


  return {
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
    handleSave,
    setIsSaving,
    isSaving,
    setError,
    error
  };
};
