import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from "react-router";
import { useState } from 'react';
import type { Problem as ProblemType } from "../types";

const fetchProblems = async () => {
  const res = await fetch('http://localhost:3000/problems');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

const createProblem = async (brief: string) => {
  const res = await fetch('http://localhost:3000/problems', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brief }),
  });
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export function Problems() {
  const queryClient = useQueryClient();
  const [brief, setBrief] = useState('');

  const { data: problems = [], isLoading } = useQuery<ProblemType[]>({
    queryKey: ['problems'],
    queryFn: fetchProblems,
  });

  const mutation = useMutation({
    mutationFn: createProblem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      setBrief('');
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Problems</h1>
      <div className="flex space-x-2 mb-6 p-4 bg-white rounded-lg shadow-md"> {/* Wrapped input/button in a card */}
        <input
          type="text"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500"
          placeholder="New problem brief"
        />
        <button
          onClick={() => mutation.mutate(brief)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Problem
        </button>
      </div>
      <div className="space-y-4"> {/* Added space between cards */}
        {problems.map((problem) => (
          <div key={problem.id} className="bg-white p-4 rounded-lg shadow-md"> {/* Wrapped each problem in a card */}
            <Link to={`/problems/${problem.id}`} className="text-blue-600 hover:underline"> {/* Styled link */}
              {problem.brief}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
