import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Problem as ProblemType } from "../types";
import { ConfirmationModal } from "../components/ConfirmationModal";

// API function to fetch a single problem by its ID
const fetchProblem = async (id: string | undefined): Promise<ProblemType> => {
  if (!id) throw new Error("Problem ID is required");
  const res = await fetch(`http://localhost:3000/problems/${id}`);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

// API function to update a problem
const updateProblem = async ({ id, brief, relatedResearch, relatedExperiments }: ProblemType): Promise<ProblemType> => {
    const res = await fetch(`http://localhost:3000/problems/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief, relatedResearch, relatedExperiments }),
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
}

// API function to delete a problem
const deleteProblem = async (id: string): Promise<void> => {
    const res = await fetch(`http://localhost:3000/problems/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Network response was not ok');
}

// Component for viewing, editing, and deleting a single problem
export function Problem() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [brief, setBrief] = useState('');
  const [newResearch, setNewResearch] = useState('');
  const [newExperiment, setNewExperiment] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: problem, isLoading, isError } = useQuery<ProblemType>({
    queryKey: ['problems', id],
    queryFn: () => fetchProblem(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (problem) {
        setBrief(problem.brief);
    }
  }, [problem]);

  const updateMutation = useMutation({
    mutationFn: updateProblem,
    onSuccess: (data) => {
        queryClient.setQueryData(['problems', id], data);
        queryClient.invalidateQueries({ queryKey: ['problems'], exact: true });
        setIsEditing(false);
    }
  });

  const deleteMutation = useMutation({
      mutationFn: deleteProblem,
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['problems'], exact: true });
          navigate('/problems');
      }
  });

  const handleUpdate = () => {
    if(id && brief.trim() && problem) {
        updateMutation.mutate({ id: problem.id, brief, relatedResearch: problem.relatedResearch, relatedExperiments: problem.relatedExperiments });
    }
  }

  const handleDeleteConfirm = () => {
      if(id) {
          deleteMutation.mutate(id);
          setIsDeleteModalOpen(false);
      }
  }

  const handleAddResearch = () => {
    if (id && newResearch.trim() && problem) {
      const updatedProblem = {
        ...problem,
        relatedResearch: [...(problem.relatedResearch || []), newResearch.trim()],
      };
      updateMutation.mutate({...updatedProblem, id: updatedProblem.id});
      setNewResearch('');
    }
  };

  const handleAddExperiment = () => {
    if (id && newExperiment.trim() && problem) {
      const updatedProblem = {
        ...problem,
        relatedExperiments: [...(problem.relatedExperiments || []), newExperiment.trim()],
      };
      updateMutation.mutate({...updatedProblem, id: updatedProblem.id});
      setNewExperiment('');
    }
  };


  if (isLoading) return <div className="text-center p-4">Loading problem details...</div>;
  if (isError) return <div className="text-center p-4 text-red-600">Error fetching problem data.</div>;
  if (!problem) return <div className="text-center p-4">Problem not found.</div>

  return (
    <>
      <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Problem"
          message="Are you sure you want to delete this problem? This action cannot be undone."
      />
      <h1 className="text-3xl font-bold mb-4">Problem Details</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex space-x-2 justify-between items-start">
          {isEditing ? (
            <div className="flex-1">
              <textarea
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={1}
              />
            </div>
          ) : (
            <p className="flex-1 py-2 text-gray-700 whitespace-pre-wrap">{problem.brief}</p>
          )}
          <button onClick={() => setIsEditing(!isEditing)} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors">
              {isEditing ? 'Cancel' : 'Edit'}
          </button>
          {isEditing ? (
            <button onClick={handleUpdate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Save
            </button>
          ) : (
            <button onClick={() => setIsDeleteModalOpen(true)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                Delete
            </button>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Related Research</h2>
        <div className="bg-white p-4 rounded-lg shadow-md text-gray-500">
          {problem.relatedResearch && problem.relatedResearch.length > 0 ? (
            <ul>
              {problem.relatedResearch.map((research, index) => (
                <li key={index} className="mb-2 whitespace-pre-wrap">{research}</li>
              ))}
            </ul>
          ) : (
            <p>No research associated with this problem yet.</p>
          )}
          <div className="mt-4 flex">
            <textarea
              value={newResearch}
              onChange={(e) => setNewResearch(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 mr-2"
              rows={2}
              placeholder="Add new research..."
            />
            <button onClick={handleAddResearch} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Add Research
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Related Experiments</h2>
        <div className="bg-white p-4 rounded-lg shadow-md text-gray-500">
          {problem.relatedExperiments && problem.relatedExperiments.length > 0 ? (
            <ul>
              {problem.relatedExperiments.map((experiment, index) => (
                <li key={index} className="mb-2 whitespace-pre-wrap">{experiment}</li>
              ))}
            </ul>
          ) : (
            <p>No experiments created for this problem yet.</p>
          )}
          <div className="mt-4 flex">
            <textarea
              value={newExperiment}
              onChange={(e) => setNewExperiment(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 mr-2"
              rows={2}
              placeholder="Add new experiment..."
            />
            <button onClick={handleAddExperiment} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Add Experiment
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
