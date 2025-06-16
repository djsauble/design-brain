import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Problem as ProblemType, Research } from "../types";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { FaTimes } from 'react-icons/fa';
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { InputWithButton } from "../components/InputWithButton";

// API function to fetch a single problem by its ID
const fetchProblem = async (id: string | undefined): Promise<ProblemType> => {
  if (!id) throw new Error("Problem ID is required");
  const res = await fetch(`http://localhost:3000/problems/${id}`);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

// API function to update a problem
const updateProblem = async ({ id, brief, relatedExperiments }: ProblemType): Promise<ProblemType> => {
    const res = await fetch(`http://localhost:3000/problems/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief, relatedExperiments }),
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
}

// API function to fetch research items for a problem
const fetchResearch = async (problemId: string | undefined): Promise<Research[]> => {
  if (!problemId) return [];
  const res = await fetch(`http://localhost:3000/problems/${problemId}/research`);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

// API function to create a research item
const createResearch = async ({ problemId, content }: { problemId: string, content: string }): Promise<Research> => {
  const res = await fetch(`http://localhost:3000/problems/${problemId}/research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problemId, content }),
  });
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

// API function to delete a research item
const deleteResearch = async ({ problemId, researchId }: { problemId: string, researchId: string }): Promise<void> => {
  const res = await fetch(`http://localhost:3000/problem/${problemId}/research/${researchId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problemId }),
  });
  if (!res.ok) throw new Error('Network response was not ok');
};

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

  const { data: problem, isLoading: isLoadingProblem, isError: isErrorProblem } = useQuery<ProblemType>({
    queryKey: ['problems', id],
    queryFn: () => fetchProblem(id),
    enabled: !!id,
  });

  const { data: research, isLoading: isLoadingResearch, isError: isErrorResearch } = useQuery<Research[]>({
    queryKey: ['research', id],
    queryFn: () => fetchResearch(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (problem) {
        setBrief(problem.brief);
    }
  }, [problem]);

  const createResearchMutation = useMutation({
    mutationFn: createResearch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['research', id] });
      setNewResearch('');
    },
  });

  const deleteResearchMutation = useMutation({
    mutationFn: deleteResearch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['research', id] });
    },
  });

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
        updateMutation.mutate({ id: problem.id, brief, research: problem.research, relatedExperiments: problem.relatedExperiments });
    }
  }

  const handleDeleteConfirm = () => {
      if(id) {
          deleteMutation.mutate(id);
          setIsDeleteModalOpen(false);
      }
  }

  const handleAddResearch = () => {
    if (id && newResearch.trim()) {
      createResearchMutation.mutate({ problemId: id, content: newResearch.trim() });
    }
  };

  const handleDeleteResearch = (researchId: string) => {
    if (id) {
      deleteResearchMutation.mutate({ problemId: id, researchId });
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


  if (isLoadingProblem || isLoadingResearch) return <div className="text-center p-4">Loading problem details...</div>;
  if (isErrorProblem || isErrorResearch) return <div className="text-center p-4 text-red-600">Error fetching data.</div>;
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
      <Card>
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
          <Button variant="warning" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel' : 'Edit'}
          </Button>
          {isEditing ? (
            <Button variant="primary" onClick={handleUpdate}>
                Save
            </Button>
          ) : (
            <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
                Delete
            </Button>
          )}
        </div>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Related Research</h2>
        <Card className="mb-6">
          <InputWithButton
            value={newResearch}
            onChange={(e) => setNewResearch(e.target.value)}
            onButtonClick={handleAddResearch}
            placeholder="Add new research..."
            buttonText="Add Research"
            buttonVariant="success"
            inputType="textarea"
          />
        </Card>
        <div className="space-y-4">
          {research && research.length > 0 ? (
            research.map((research) => (
              <Card key={research._id} className="flex justify-between items-start">
                <p className="flex-1 pr-4 whitespace-pre-wrap">{research.content}</p>
                <Button variant="danger" className="p-1" onClick={() => handleDeleteResearch(research._id)}>
                  <FaTimes />
                </Button>
              </Card>
            ))
          ) : (
            <p>No research associated with this problem yet.</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Related Experiments</h2>
        <Card className="mb-6">
          <InputWithButton
            value={newExperiment}
            onChange={(e) => setNewExperiment(e.target.value)}
            onButtonClick={handleAddExperiment}
            placeholder="Add new experiment..."
            buttonText="Add Experiment"
            buttonVariant="success"
            inputType="textarea"
          />
        </Card>
        <div className="space-y-4">
          {problem.relatedExperiments && problem.relatedExperiments.length > 0 ? (
            problem.relatedExperiments.map((experiment, index) => (
              <Card>
                <Link key={index} to="#">
                  {experiment}
                </Link>
              </Card>
            ))
          ) : (
            <p>No experiments created for this problem yet.</p>
          )}
        </div>
      </div>
    </>
  );
}
