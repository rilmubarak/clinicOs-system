type ModalType = 'error' | 'success' | 'confirm';

interface ModalProps {
  type: ModalType;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
}

interface ContentProps {
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
}

const ModalContent = ({ type, message, onClose, onConfirm }: ContentProps & { type: ModalType }) => {
  const headers = {
    error: 'Error',
    success: 'Success',
    confirm: 'Confirm Action',
  };

  const colors = {
    error: 'red',
    success: 'green',
    confirm: 'blue',
  };

  console.log('object :>> ', `bg-${colors[type]}-500`);

  const actions = type === 'confirm' ? (
    <>
      <button
        onClick={() => {
          if (onConfirm) onConfirm();
          onClose();
        }}
        className={`px-4 py-2 bg-${colors[type]}-500 text-white rounded-md hover:bg-${colors[type]}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${colors[type]}-500 text-sm sm:text-base`}
      >
        Confirm
      </button>
      <button
        onClick={onClose}
        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-sm sm:text-base"
      >
        Cancel
      </button>
    </>
  ) : (
    <button
      onClick={onClose}
        className={`px-4 py-2 bg-${colors[type]}-500 text-white rounded-md hover:bg-${colors[type]}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${colors[type]}-500 text-sm sm:text-base`}
    >
      Close
    </button>
  );

  return (
    <>
      <h3 className={`text-lg font-semibold text-${colors[type]}-600 border-b border-gray-300 pb-2 mb-4`}>{headers[type]}</h3>
      <p className="text-gray-700 mb-6 text-sm sm:text-base md:text-lg">{message}</p>
      <div className="flex justify-end space-x-4">
        {actions}
      </div>
    </>
  );
};

const Modal = ({ type, message, onClose, onConfirm }: ModalProps) => (
  <div
    role="dialog"
    aria-labelledby="modal-title"
    aria-modal="true"
    className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 p-4"
  >
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
      <ModalContent type={type} message={message} onClose={onClose} onConfirm={onConfirm} />
    </div>
  </div>
);

export default Modal;
