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
      <div className="mb-4">
        <input
          type="text"
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          className="p-2 border rounded-md"
          placeholder="New problem brief"
        />
        <button
          onClick={() => mutation.mutate(brief)}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Add Problem
        </button>
      </div>
      <ul>
        {problems.map((problem) => (
          <li key={problem.id} className="p-2 border-b">
            <Link to={`/problems/${problem.id}`}>{problem.brief}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
