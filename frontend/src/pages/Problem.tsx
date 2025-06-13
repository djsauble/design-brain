import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Problem as ProblemType } from "../types";
import { ConfirmationModal } from "../components/ConfirmationModal";

// API function to fetch a single problem by its ID
const fetchProblem = async (id: string | undefined): Promise<ProblemType> => {
  if (!id) throw new Error("Problem ID is required");
  const res = await fetch(`/api/problems/${id}`);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

// API function to update a problem
const updateProblem = async ({ id, brief }: { id: string; brief: string }): Promise<ProblemType> => {
    const res = await fetch(`/api/problems/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief }),
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
}

// API function to delete a problem
const deleteProblem = async (id: string): Promise<void> => {
    const res = await fetch(`/api/problems/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Network response was not ok');
}

// Component for viewing, editing, and deleting a single problem
export function Problem() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [brief, setBrief] = useState('');
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
    if(id && brief.trim()) {
        updateMutation.mutate({ id, brief });
    }
  }

  const handleDeleteConfirm = () => {
      if(id) {
          deleteMutation.mutate(id);
          setIsDeleteModalOpen(false);
      }
  }

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
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Problem Details</h1>
          <div className="flex space-x-2">
              <button onClick={() => setIsEditing(!isEditing)} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors">
                  {isEditing ? 'Cancel' : 'Edit'}
              </button>
              <button onClick={() => setIsDeleteModalOpen(true)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                  Delete
              </button>
          </div>
        </div>
        
        {isEditing ? (
          <div>
              <textarea
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={5}
              />
              <button onClick={handleUpdate} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Save Changes
              </button>
          </div>
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap">{problem.brief}</p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Related Research</h2>
        <div className="bg-white p-4 rounded-lg shadow-md text-gray-500">
          {/* Placeholder for where you would list related research items */}
          <p>Research associated with this problem will be listed here.</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Related Experiments</h2>
        <div className="bg-white p-4 rounded-lg shadow-md text-gray-500">
          {/* Placeholder for where you would list related experiment items */}
          <p>Experiments created to solve this problem will be listed here.</p>
        </div>
      </div>
    </>
  );
}
