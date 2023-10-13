import { useEffect, useState, React } from 'react';
import { useAuthState } from '~/components/contexts/UserContext';

import { Head } from '~/components/shared/Head';
import { useFirestore } from '~/lib/firebase';
import { collection, query, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ToolCard from '../shared/ToolCard';

export type Tool = {
  id: string;
  title: string;
  description: string;
  url: string;
};

export enum InputEnum {
  Id = 'id',
  Title = 'title',
  Description = 'description',
  Url = 'url',
}

function Index() {
  const { state } = useAuthState();
  const [tools, setTools] = useState<Array<Tool>>([]);
  const firestore = useFirestore();
  const [inputData, setInputData] = useState<Partial<Tool>>({
    title: '',
    description: '',
    url: '',
  });

  const [formError, setFormError] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      const toolsCollections = collection(firestore, 'tools');
      const toolsQuery = query(toolsCollections);
      const querySnapshot = await getDocs(toolsQuery);
      const fetchedData: Array<Tool> = [];
      querySnapshot.forEach((doc) => {
        fetchedData.push({ id: doc.id, ...doc.data() } as Tool);
      });

      setTools(fetchedData);
    }

    fetchData();
  }, []);

  const onUpdateTool = (id: string, data: Partial<Tool>) => {
    const docRef = doc(firestore, 'tools', id);
    updateDoc(docRef, data)
      .then((docRef) => {
        toast('🦄 Wow so easy!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleInputChange = (field: InputEnum, value: string) => {
    setInputData({ ...inputData, [field]: value });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const toolsCollections = collection(firestore, 'tools');

      const newTool: Partial<Tool> = {
        title: inputData.title,
        description: inputData.description,
        url: inputData.url,
      };
      const docRef = await addDoc(toolsCollections, newTool);

      toast('🦄 Wow so easy!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });

      setTools([...tools, { ...(newTool as Tool) }]);
      setInputData({ title: '', description: '', url: '' });
    } catch (error) {
      setFormError(true);
    }
  };

  return (
    <>
      <Head title="TOP PAGE" />
      <div className="hero min-h-screen bg-slate-800">
        <div className="max-w-5xl mx-auto">
          <form className="flex" onSubmit={handleFormSubmit}>
            <input
              type="text"
              onChange={(e) => handleInputChange(InputEnum.Title, e.target.value)}
              value={inputData.title}
              placeholder="title"
              className="m-4 rounded-lg border border-slate-700 bg-transparent p-4 text-slate-50 focus:outline-none focus:ring-slate-400"
            />
            <input
              type="text"
              onChange={(e) => handleInputChange(InputEnum.Description, e.target.value)}
              value={inputData.description}
              placeholder="description"
              className="m-4 rounded-lg border border-slate-700 bg-transparent p-4 text-slate-50 focus:outline-none focus:ring-slate-400"
            />
            <input
              type="text"
              onChange={(e) => handleInputChange(InputEnum.Url, e.target.value)}
              value={inputData.url}
              placeholder="url"
              className="m-4 rounded-lg border border-slate-700 bg-transparent p-4 text-slate-50 focus:outline-none focus:ring-slate-400"
            />
            <button
              type="submit"
              className="m-4 rounded-lg border border-purple-500 bg-purple-600 bg-opacity-30 p-5 text-slate-50 transition-opacity hover:bg-opacity-50 "
            >
              Add new tool
            </button>
          </form>
          <div className="grid w-full grid-cols-3 gap-4 bg-transparent text-slate-50">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} onUpdate={onUpdateTool} />
            ))}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Index;
