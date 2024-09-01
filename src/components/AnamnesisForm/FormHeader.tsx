interface FormHeaderProps {
  formTitle: string;
  setFormTitle: (title: string) => void;
  formDescription: string;
  setFormDescription: (description: string) => void;
}

const FormHeader = ({
  formTitle,
  setFormTitle,
  formDescription,
  setFormDescription
}: FormHeaderProps) => (
  <>
    <div className="mb-4">
      <label htmlFor="formTitle" className="block text-sm font-medium text-gray-700 mb-1">Form Title</label>
      <input
        type="text"
        id="formTitle"
        placeholder="Form Title"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
    <div className="mb-6">
      <label htmlFor="formDescription" className="block text-sm font-medium text-gray-700 mb-1">Form Description</label>
      <textarea
        id="formDescription"
        placeholder="Form Description"
        value={formDescription}
        onChange={(e) => setFormDescription(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  </>
);

export default FormHeader;
