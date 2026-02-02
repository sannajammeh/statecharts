import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { Visualizer } from "./Visualizer";
import type { ExportedChart } from "./types";

const EXAMPLE_CHARTS: Record<string, ExportedChart> = {
  toggle: {
    version: 1,
    id: "toggle",
    initial: "inactive",
    context: { count: 0 },
    states: {
      inactive: {
        on: { TOGGLE: { target: "active", guard: null, actions: ["increment"] } },
      },
      active: {
        on: { TOGGLE: { target: "inactive", guard: null, actions: [] } },
      },
    },
  },
  trafficLight: {
    version: 1,
    id: "trafficLight",
    initial: "red",
    context: {},
    states: {
      red: {
        on: { NEXT: { target: "green", guard: null, actions: [] } },
      },
      green: {
        on: { NEXT: { target: "yellow", guard: null, actions: [] } },
      },
      yellow: {
        on: { NEXT: { target: "red", guard: null, actions: [] } },
      },
    },
  },
  fetchMachine: {
    version: 1,
    id: "fetch",
    initial: "idle",
    context: { data: null, error: null },
    states: {
      idle: {
        on: { FETCH: { target: "loading", guard: null, actions: [] } },
      },
      loading: {
        on: {
          SUCCESS: { target: "success", guard: null, actions: ["setData"] },
          FAILURE: { target: "failure", guard: null, actions: ["setError"] },
        },
      },
      success: {
        type: "final" as const,
      },
      failure: {
        on: { RETRY: { target: "loading", guard: null, actions: ["clearError"] } },
      },
    },
  },
};

export function App(): React.JSX.Element {
  const [chart, setChart] = useState<ExportedChart | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chartUrl = params.get("chart");
    if (chartUrl) {
      loadFromUrl(chartUrl);
    }
  }, []);

  const loadFromUrl = useCallback(async (url: string) => {
    try {
      setError(null);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
      const data = (await response.json()) as ExportedChart;
      setChart(data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Failed to load chart from URL"
      );
    }
  }, []);

  const handleFileDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    []
  );

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        setError(null);
        const data = JSON.parse(e.target?.result as string) as ExportedChart;
        setChart(data);
      } catch (err) {
        const message =
          err instanceof Error
            ? `Invalid JSON file: ${err.message}`
            : "Invalid JSON file";
        setError(message);
      }
    };
    reader.readAsText(file);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleUrlSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (urlInput.trim()) {
        loadFromUrl(urlInput.trim());
      }
    },
    [urlInput, loadFromUrl]
  );

  const handleExampleSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const key = e.target.value;
      if (key && EXAMPLE_CHARTS[key]) {
        setError(null);
        setChart(EXAMPLE_CHARTS[key]);
      }
    },
    []
  );

  if (chart) {
    return (
      <div className="h-screen flex flex-col">
        <header className="h-12 border-b border-gray-200 flex items-center px-4 gap-4 bg-white">
          <h1 className="font-semibold">Statechart Visualizer</h1>
          <span className="text-gray-400">|</span>
          <span className="text-sm text-gray-600">{chart.id}</span>
          <button
            type="button"
            onClick={() => setChart(null)}
            className="ml-auto text-sm text-blue-600 hover:underline"
          >
            Load different chart
          </button>
        </header>
        <div className="flex-1">
          <Visualizer chart={chart} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div
        className="max-w-xl w-full space-y-6"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Statechart Visualizer</h1>
          <p className="text-gray-600">
            Visualize and interact with statechart definitions
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Load from file
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".json"
                onChange={handleFileInput}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer text-gray-600"
              >
                <span className="text-blue-600 hover:underline">
                  Choose a file
                </span>{" "}
                or drag and drop
              </label>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>

          <form onSubmit={handleUrlSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Load from URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/chart.json"
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Load
              </button>
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Try an example
            </label>
            <select
              onChange={handleExampleSelect}
              defaultValue=""
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>
                Select an example...
              </option>
              <option value="toggle">Toggle Machine</option>
              <option value="trafficLight">Traffic Light</option>
              <option value="fetchMachine">Fetch Machine</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
