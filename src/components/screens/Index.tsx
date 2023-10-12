import { Dialog } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import { useAuthState } from '~/components/contexts/UserContext';
import { SignInButton } from '~/components/domain/auth/SignInButton';
import { SignOutButton } from '~/components/domain/auth/SignOutButton';
import { Head } from '~/components/shared/Head';
import { useFirestore } from '~/lib/firebase';
import { collection, query, getDocs } from 'firebase/firestore';

type Tool = {
  id: string;
  title: string;
  description: string;
  url: string;
};

function Index() {
  const { state } = useAuthState();
  const [tools, setTools] = useState<Array<Tool>>([]);
  const firestore = useFirestore();

  useEffect(() => {
    async function fetchData() {
      const toolsCollections = collection(firestore, 'tools');
      const toolsQuery = query(toolsCollections);
      const querySnapshot = await getDocs(toolsQuery);
      const fetchedData: Array<Tool> = [];
      querySnapshot.forEach((doc) => {
        fetchedData.push({ id: doc.id, ...doc.data() } as Tool);
      });
      console.table(fetchedData);
      setTools(fetchedData);
    }

    fetchData();
  }, []);

  return (
    <>
      <Head title="TOP PAGE" />
      <div className="hero min-h-screen bg-slate-800">
        <div className="max-w-5xl mx-auto">
          <form className="flex">
            <input
              type="text"
              placeholder="title"
              className="m-4 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
            />
            <input
              type="text"
              placeholder="description"
              className="m-4 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
            />
            <input
              type="text"
              placeholder="url"
              className="m-4 text-slate-50 bg-transparent border border-slate-700 focus:ring-slate-400 focus:outline-none p-4 rounded-lg"
            />
            <button
              type="submit"
              className="m-4 text-slate-50 border border-purple-500 p-5 rounded-lg bg-purple-600 bg-opacity-30 transition-opacity hover:bg-opacity-50 "
            >
              Add new tool
            </button>
          </form>
          <table className="table w-full bg-transparent text-slate-50">
            <thead>
              <tr>
                <th className="bg-slate-900 border border-slate-700">Title</th>
                <th className="bg-slate-900 border border-slate-700">Description</th>
                <th className="bg-slate-900 border border-slate-700">Link</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool) => (
                <tr key={tool.id}>
                  <td className="bg-slate-800 border border-slate-700">{tool.title}</td>
                  <td className="bg-slate-800 border border-slate-700">{tool.description}</td>
                  <td className="bg-slate-800 border border-slate-700">{tool.url}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Index;
