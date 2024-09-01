import { Question } from 'src/types';

interface QuestionTypeButtonsProps {
  sectionId: string;
  addQuestion: (sectionId: string, type: Question['type']) => void;
}

const QuestionTypeButtons = ({ sectionId, addQuestion }: QuestionTypeButtonsProps) => (
  <div className="mb-4 flex flex-col gap-2 md:flex-row md:gap-4">
  <button
    onClick={() => addQuestion(sectionId, 'short_text')}
    className="w-full md:w-1/2 border border-neutral-600 text-neutral-600 px-4 py-2 rounded-md shadow-sm bg-transparent hover:bg-stone-300 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:ring-offset-2 transition-colors duration-200"
  >
    Add Short Text Question
  </button>
  <button
    onClick={() => addQuestion(sectionId, 'long_text')}
    className="w-full md:w-1/2 border border-neutral-600 text-neutral-600 px-4 py-2 rounded-md shadow-sm bg-transparent hover:bg-stone-300 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 transition-colors duration-200"
  >
    Add Long Text Question
  </button>
  <button
    onClick={() => addQuestion(sectionId, 'multiple_choice')}
    className="w-full md:w-1/2 border border-neutral-600 text-neutral-600 px-4 py-2 rounded-md shadow-sm bg-transparent hover:bg-stone-300 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 transition-colors duration-200"
  >
    Add Multiple Choice Question
  </button>
  <button
    onClick={() => addQuestion(sectionId, 'date_time')}
    className="w-full md:w-1/2 border border-neutral-600 text-neutral-600 px-4 py-2 rounded-md shadow-sm bg-transparent hover:bg-stone-300 focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:ring-offset-2 transition-colors duration-200"
  >
    Add Date Time Question
  </button>
</div>


);

export default QuestionTypeButtons;
