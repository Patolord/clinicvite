import { useState } from 'react';
import { Tool, InputEnum } from '../screens/Index';
import { PencilSquareIcon, CheckIcon, XCircleIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface ToolCardProps {
  tool: Tool;
  onUpdate: (id: string, data: Partial<Tool>) => void;
}

const ToolCard = ({ tool, onUpdate }: ToolCardProps) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [inputData, setInputData] = useState<Partial<Tool>>(tool);

  const toggleIsEdit = () => setIsEdit((prevIsEdit) => !prevIsEdit);

  const onClose = () => {
    setIsEdit(false);
    setInputData(tool);
  };

  const handleUpdate = () => {
    setIsEdit(false);
    onUpdate(tool.id, inputData);
  };

  const handleInputChange = (field: InputEnum, value: string) => {
    setInputData({ ...inputData, [field]: value });
  };

  const inputClasses = clsx('bg-transparent', 'border-0', 'py-2', 'px-4', 'rounded-md');

  return (
    <div
      key={tool.id}
      className="group relative flex h-48 flex-col justify-between rounded-md bg-gradient-to-r from-slate-800 to-slate-700 p-4 shadow-md shadow-slate-900"
    >
      <div>
        <input
          className={clsx(inputClasses, 'mb-2 text-xl font-bold text-slate-50', {
            'bg-gray-900': isEdit,
            'cursor-text': isEdit,
          })}
          value={inputData.title}
          onChange={(e) => handleInputChange(InputEnum.Title, e.target.value)}
        />
        <input
          className={clsx(inputClasses, { 'bg-gray-900': isEdit, 'cursor-text': isEdit })}
          value={inputData.description}
          onChange={(e) => handleInputChange(InputEnum.Description, e.target.value)}
        />
      </div>
      <input
        className={clsx(inputClasses, 'text-slate-400', { 'bg-gray-900': isEdit, 'cursor-text': isEdit })}
        value={tool.url}
        onChange={(e) => handleInputChange(InputEnum.Url, e.target.value)}
      />
      {isEdit ? (
        <>
          <CheckIcon
            onClick={handleUpdate}
            className="absolute right-12 top-4  h-6 w-6 cursor-pointer text-green-500 "
          />
          <XCircleIcon onClick={onClose} className="absolute right-4 top-4   h-6 w-6 cursor-pointer text-red-900 " />
        </>
      ) : (
        <button
          onClick={toggleIsEdit}
          className="btn btn-active btn-ghost absolute right-4 top-4 hidden p-0 group-hover:block"
        >
          <PencilSquareIcon className="h-6 w-6 cursor-pointer text-slate-100" />
        </button>
      )}
      <button className="bg-sky-700 px-4 py-2 text-white hover:bg-sky-800 sm:px-8 sm:py-3">...</button>
    </div>
  );
};

export default ToolCard;
