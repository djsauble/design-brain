import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from "react-router";
import { useState } from 'react';
import type { Problem } from "../types";
import { Card } from "../components/Card";
import { InputWithButton } from "../components/InputWithButton";

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

const updateProblem = async (problem: Problem) => {
  const res = await fetch(`http://localhost:3000/problems/${problem.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(problem),
  });
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

export function Problems() {
  const queryClient = useQueryClient();
  const [brief, setBrief] = useState('');

  const { data: problems = [], isLoading } = useQuery<Problem[]>({
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

  const updateMutation = useMutation({
   mutationFn: updateProblem,
   onSuccess: () => {
     queryClient.invalidateQueries({ queryKey: ['problems'] });
   },
 });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Problems</h1>
      <Card className="mb-6">
        <InputWithButton
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          onButtonClick={() => mutation.mutate(brief)}
          placeholder="New problem brief"
          buttonText="Add Problem"
          inputType="textarea"
        />
      </Card>
      <div className="space-y-4">
        {problems.map((problem) => (
          <Card key={problem.id} className="flex items-center space-x-2 justify-between">
            <input
              type="checkbox"
              id={`investigate-${problem.id}`}
              checked={problem.isInvestigate || false}
              onChange={() => updateMutation.mutate({ ...problem, isInvestigate: !problem.isInvestigate })}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <Link to={`/problems/${problem.id}`} className="flex-grow">
              {problem.brief}
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
