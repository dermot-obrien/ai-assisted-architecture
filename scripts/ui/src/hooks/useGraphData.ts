import { useState, useEffect, useCallback } from "react";
import type { Graph, ConceptsResponse } from "../types";

interface UseGraphDataResult {
  graphData: Graph | null;
  concepts: ConceptsResponse | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useGraphData(): UseGraphDataResult {
  const [graphData, setGraphData] = useState<Graph | null>(null);
  const [concepts, setConcepts] = useState<ConceptsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGraph = useCallback(async (doRefresh: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const url = doRefresh ? "/api/graph?refresh=1" : "/api/graph";
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setGraphData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchConcepts = useCallback(async () => {
    try {
      const res = await fetch("/api/concepts");
      if (res.ok) {
        const data = await res.json();
        setConcepts(data);
      }
    } catch {
      // Silently ignore -- reference panel just won't load
    }
  }, []);

  useEffect(() => {
    fetchGraph(false);
    fetchConcepts();
  }, []);

  const refresh = useCallback(() => {
    fetchGraph(true);
  }, [fetchGraph]);

  return { graphData, concepts, loading, error, refresh };
}
