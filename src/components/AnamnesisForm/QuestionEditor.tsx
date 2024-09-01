import { Question } from 'src/types';
import RemoveIcon from 'src/icons/RemoveIcon';

interface QuestionEditorProps {
  question: Question;
  sectionId: string;
  onUpdate: (updatedQuestion: Question) => void;
  onRemove: (sectionId: string, questionId: string) => void;
}

const QuestionEditor = ({ question, sectionId, onUpdate, onRemove, }: QuestionEditorProps) => {
  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onUpdate({ ...question, question: e.target.value });
  };

  const handleOptionChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedOptions = [...(question.options || [])];
    updatedOptions[index] = e.target.value;
    onUpdate({ ...question, options: updatedOptions });
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = [...(question.options || [])];
    updatedOptions.splice(index, 1);
    onUpdate({ ...question, options: updatedOptions });
  };

  const handleRemoveQuestion = () => {
    onRemove(sectionId, question.id);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {question.type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())} Question
      </label>
      {question.type === 'short_text' && (
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={question.question}
            onChange={handleContentChange}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <button
            onClick={handleRemoveQuestion}
            className="text-red-500 hover:text-red-700"
            aria-label="Remove question"
          >
            <RemoveIcon />
          </button>
        </div>
      )}
      {question.type === 'long_text' && (
        <div className="flex items-center space-x-2">
          <textarea
            value={question.question}
            onChange={handleContentChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <button
            onClick={handleRemoveQuestion}
            className="text-red-500 hover:text-red-700"
            aria-label="Remove question"
          >
            <RemoveIcon />
          </button>
        </div>
      )}
      {question.type === 'multiple_choice' && Array.isArray(question.options) && (
        <>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={question.question}
              onChange={handleContentChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <button
              onClick={handleRemoveQuestion}
              className="text-red-500 hover:text-red-700"
              aria-label="Remove question"
            >
              <RemoveIcon />
            </button>
          </div>
          <button
            onClick={() => onUpdate({ ...question, options: [...(question.options || []), ''] })}
            className="bg-gray-300 text-black px-4 py-2 my-4 rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Add Option
          </button>
          {(question.options).map((option, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button
                onClick={() => handleRemoveOption(index)}
                className="ml-2 text-red-500 hover:text-red-700"
                aria-label="Remove option"
              >
                <RemoveIcon />
              </button>
            </div>
          ))}
        </>
      )}
      {question.type === 'date_time' && (
        <div className="flex items-center space-x-2">
          <input
            type="datetime-local"
            value={question.question}
            onChange={handleContentChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <button
            onClick={handleRemoveQuestion}
            className="text-red-500 hover:text-red-700"
            aria-label="Remove question"
          >
            <RemoveIcon />
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionEditor;
