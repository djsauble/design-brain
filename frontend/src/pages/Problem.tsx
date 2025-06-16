import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Problem as ProblemType } from "../types";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { InputWithButton } from "../components/InputWithButton";
import { ListItem } from "../components/ListItem";

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
        <Card className="text-gray-500">
          {problem.relatedResearch && problem.relatedResearch.length > 0 ? (
            <ul>
              {problem.relatedResearch.map((research, index) => (
                <ListItem key={index}>{research}</ListItem>
              ))}
            </ul>
          ) : (
            <p>No research associated with this problem yet.</p>
          )}
          <div className="mt-4">
            <InputWithButton
              value={newResearch}
              onChange={(e) => setNewResearch(e.target.value)}
              onButtonClick={handleAddResearch}
              placeholder="Add new research..."
              buttonText="Add Research"
              buttonVariant="success"
              inputType="textarea"
              rows={2}
            />
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Related Experiments</h2>
        <Card className="text-gray-500">
          {problem.relatedExperiments && problem.relatedExperiments.length > 0 ? (
            <ul>
              {problem.relatedExperiments.map((experiment, index) => (
                <ListItem key={index}>{experiment}</ListItem>
              ))}
            </ul>
          ) : (
            <p>No experiments created for this problem yet.</p>
          )}
          <div className="mt-4">
            <InputWithButton
              value={newExperiment}
              onChange={(e) => setNewExperiment(e.target.value)}
              onButtonClick={handleAddExperiment}
              placeholder="Add new experiment..."
              buttonText="Add Experiment"
              buttonVariant="success"
              inputType="textarea"
              rows={2}
            />
          </div>
        </Card>
      </div>
    </>
  );
}
