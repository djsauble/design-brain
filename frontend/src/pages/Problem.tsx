import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Problem, Research, Experiment } from "../types";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { FaTimes } from 'react-icons/fa';
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { InputWithButton } from "../components/InputWithButton";

// API function to fetch a single problem by its ID
const fetchProblem = async (id: string | undefined): Promise<Problem> => {
  if (!id) throw new Error("Problem ID is required");
  const res = await fetch(`http://localhost:3000/problems/${id}`);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

// API function to update a problem
const updateProblem = async ({ id, brief, relatedExperiments }: Problem): Promise<Problem> => {
    const res = await fetch(`http://localhost:3000/problems/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief, relatedExperiments }),
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
}

// API function to fetch research items for a problem
const fetchResearch = async (problem: string | undefined): Promise<Research[]> => {
  if (!problem) return [];
  const res = await fetch(`http://localhost:3000/problems/${problem}/research`);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

// API function to create a research item
const createResearch = async ({ problem, content }: { problem: string, content: string }): Promise<Research> => {
  const res = await fetch(`http://localhost:3000/problems/${problem}/research`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problem, content }),
  });
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

// API function to delete a research item
const deleteResearch = async ({ problem, id }: { problem: string, id: string }): Promise<void> => {
  const res = await fetch(`http://localhost:3000/problems/${problem}/research/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problem }),
  });
  if (!res.ok) throw new Error('Network response was not ok');
};

// API function to update research item's isApproved status
const updateResearchIsApproved = async ({ problem, research, isApproved }: { problem: string, research: string, isApproved: boolean }): Promise<Research> => {
  const res = await fetch(`http://localhost:3000/problems/${problem}/research/${research}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isApproved }),
  });
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

// API function to delete a problem
const deleteProblem = async (id: string): Promise<void> => {
    const res = await fetch(`http://localhost:3000/problems/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Network response was not ok');
}
// API function to fetch experiment items for a problem
const fetchExperiments = async (problem: string | undefined): Promise<Experiment[]> => {
  if (!problem) return [];
  const res = await fetch(`http://localhost:3000/problems/${problem}/experiments`);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

// API function to fetch approved experiment items for a problem
const fetchApprovedExperiments = async (problem: string | undefined): Promise<Experiment[]> => {
  if (!problem) return [];
  const res = await fetch(`http://localhost:3000/problems/${problem}/experiments/approved`);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

// API function to create an experiment item
const createExperiment = async ({ problem, proposal }: { problem: string, proposal: string }): Promise<Experiment> => {
  const res = await fetch(`http://localhost:3000/problems/${problem}/experiments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problem, proposal }),
  });
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

// API function to delete an experiment item
const deleteExperiment = async ({ problem, id }: { problem: string, id: string }): Promise<void> => {
  const res = await fetch(`http://localhost:3000/problems/${problem}/experiments/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problem }),
  });
  if (!res.ok) throw new Error('Network response was not ok');
};

// API function to update experiment approval
const updateExperimentIsApproved = async ({ problem, experiment, isApproved }: { problem: string, experiment: string, isApproved: boolean }): Promise<Experiment> => {
  const res = await fetch(`http://localhost:3000/problems/${problem}/experiments/${experiment}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isApproved }),
  });
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

// API function to update experiment status
const updateExperimentStatus = async ({ problem, experiment, status }: { problem: string, experiment: string, status: string }) => {
  const res = await fetch(`http://localhost:3000/problems/${problem}/experiments/${experiment}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

// API function to update experiment URL
const updateExperimentUrl = async ({ problem, experiment, url }: { problem: string, experiment: string, url: string }) => {
  const res = await fetch(`http://localhost:3000/problems/${problem}/experiments/${experiment}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

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

  const { data: problem, isLoading: isLoadingProblem, isError: isErrorProblem } = useQuery<Problem>({
    queryKey: ['problems', id],
    queryFn: () => fetchProblem(id),
    enabled: !!id,
  });

  const { data: research, isLoading: isLoadingResearch, isError: isErrorResearch } = useQuery<Research[]>({
    queryKey: ['research', id],
    queryFn: () => fetchResearch(id),
    enabled: !!id,
  });

  const { data: experiments, isLoading: isLoadingExperiments, isError: isErrorExperiments } = useQuery<Experiment[]>({
    queryKey: ['experiments', id],
    queryFn: () => fetchExperiments(id),
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

  const updateResearchIsApprovedMutation = useMutation({
    mutationFn: updateResearchIsApproved,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['research', id] });
    },
  });

  const createExperimentMutation = useMutation({
    mutationFn: createExperiment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiments', id] });
      setNewExperiment('');
    },
  });

  const deleteExperimentMutation = useMutation({
    mutationFn: deleteExperiment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiments', id] });
    },
  });

  const updateExperimentIsApprovedMutation = useMutation({
    mutationFn: updateExperimentIsApproved,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiments', id] });
    },
  });

  const updateExperimentStatusMutation = useMutation({
    mutationFn: updateExperimentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiments', id] });
    },
  });

  const updateExperimentUrlMutation = useMutation({
    mutationFn: updateExperimentUrl,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiments', id] });
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
      createResearchMutation.mutate({ problem: id, content: newResearch.trim() });
      setNewResearch('');
    }
  };

  const handleDeleteResearch = (problem: string, id: string) => {
    if (id) {
      deleteResearchMutation.mutate({ problem: problem, id });
    }
  };

  const handleAddExperiment = () => {
    if (id && newExperiment.trim()) {
      createExperimentMutation.mutate({ problem: id, proposal: newExperiment.trim() });
    }
  };

  const handleDeleteExperiment = (problem: string, id: string) => {
    if (id) {
      deleteExperimentMutation.mutate({ problem: problem, id });
    }
  };

  const handleUpdateExperimentIsApproved = (problem: string, experiment: string, isApproved: boolean) => {
    if (id) {
      updateExperimentIsApprovedMutation.mutate({ problem: problem, experiment: experiment, isApproved: isApproved });
    }
  };

  const handleUpdateExperimentStatus = (problem: string, experiment: string, status: string) => {
    if (id) {
      updateExperimentStatusMutation.mutate({ problem: problem, experiment: experiment, status: status });
    }
  };

  const handleUpdateExperimentUrl = (problem: string, experiment: string, url: string) => {
    if (id) {
      updateExperimentUrlMutation.mutate({ problem: problem, experiment: experiment, url: url });
    }
  };


  if (isLoadingProblem || isLoadingResearch || isLoadingExperiments) return <div className="text-center p-4">Loading problem details...</div>;
  if (isErrorProblem || isErrorResearch || isErrorExperiments) return <div className="text-center p-4 text-red-600">Error fetching data.</div>;
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
              <Card key={research.id} className="flex justify-between items-start">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={research.isApproved || false}
                    onChange={(e) => updateResearchIsApprovedMutation.mutate({ problem: problem.id.toString(), research: research.id, isApproved: e.target.checked })}
                    className="mr-2"
                  />
                  <p className="flex-1 pr-4 whitespace-pre-wrap">{research.content}</p>
                </div>
                <Button variant="danger" className="p-1" onClick={() => handleDeleteResearch(problem.id.toString(), research.id)}>
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
            placeholder="Propose an experiment..."
            buttonText="Add Experiment"
            buttonVariant="success"
            inputType="input"
          />
        </Card>
        <div className="space-y-4">
          {experiments && experiments.length > 0 ? (
            experiments.map((experiment) => (
              <Card key={experiment.id} className="flex flex-col space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={experiment.isApproved || false}
                      onChange={(e) => handleUpdateExperimentIsApproved(problem.id.toString(), experiment.id.toString(), e.target.checked)}
                      className="mr-2"
                    />
                    <p className="flex-1 pr-4 whitespace-pre-wrap">{experiment.proposal}</p>
                  </div>
                  <Button variant="danger" className="p-1" onClick={() => handleDeleteExperiment(problem.id.toString(), experiment.id.toString())}>
                    <FaTimes />
                  </Button>
                </div>
                <div className="flex justify-between space-x-2 items-center text-sm text-gray-600">
                  <select
                    value={experiment.status || 'NOT STARTED'}
                    onChange={(e) => handleUpdateExperimentStatus(problem.id.toString(), experiment.id.toString(), e.target.value)}
                    className="border rounded-md p-1 h-[30px]"
                  >
                    <option value="NOT STARTED">Not started</option>
                    <option value="IN PROGRESS">In progress</option>
                    <option value="FINISHED">Finished</option>
                  </select>
                  <input
                    type="text"
                    value={experiment.url || ''}
                    onChange={(e) => handleUpdateExperimentUrl(problem.id.toString(), experiment.id.toString(), e.target.value)}
                    className="border rounded-md p-1 flex-1"
                    placeholder="Result URL"
                  />
                </div>
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
