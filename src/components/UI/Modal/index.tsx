type ModalType = 'error' | 'confirm';

interface ModalProps {
  type: ModalType;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
}

interface ContentProps {
  message: string;
  onClose: () => void;
  onConfirm?: (val?:string) => void;
}

const ErrorModalContent = ({ message, onClose }: ContentProps) => (
  <>
    <h3 className="text-lg font-semibold text-red-600 border-b border-gray-300 pb-2 mb-4">Error</h3>
    <p className="text-gray-700 mb-6 text-sm sm:text-base md:text-lg">{message}</p>
    <div className="flex justify-end">
      <button
        onClick={onClose}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-sm sm:text-base"
      >
        Close
      </button>
    </div>
  </>
);

const ConfirmModalContent = ({ message, onClose, onConfirm }: ContentProps) => (
  <>
    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-2 mb-4">Confirm Action</h3>
    <p className="text-gray-700 mb-6 text-sm sm:text-base md:text-lg">{message}</p>
    <div className="flex justify-end space-x-4">
      <button
        onClick={() => {
          if (onConfirm) onConfirm();
          onClose();
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm sm:text-base"
      >
        Confirm
      </button>
      <button
        onClick={onClose}
        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-sm sm:text-base"
      >
        Cancel
      </button>
    </div>
  </>
);

const Modal = ({ type, message, onClose, onConfirm }: ModalProps) => {
  const Content = type === 'error' ? ErrorModalContent : ConfirmModalContent;

  return (
    <div
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 p-4"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
        <Content message={message} onClose={onClose} onConfirm={onConfirm} />
      </div>
    </div>
  );
};

export default Modal;
