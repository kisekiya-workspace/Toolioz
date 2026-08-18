"use client";

import React, { useState, useEffect } from "react";
import { GitGraph } from "@/components/sociials-tools/github-simulator/GitGraph";
import { Controls } from "@/components/sociials-tools/github-simulator/Controls";
import { FileExplorer } from "@/components/sociials-tools/github-simulator/FileExplorer";
import { ConflictResolver } from "@/components/sociials-tools/github-simulator/ConflictResolver";
import { GitLog } from "@/components/sociials-tools/github-simulator/GitLog";
import { GitTerminal } from "@/components/sociials-tools/github-simulator/GitTerminal";
import { GitCheatSheet } from "@/components/sociials-tools/github-simulator/GitCheatSheet";
import { useGitSimulation, File } from "@/hooks/useGitSimulation";
import { Button } from "@/components/sociials-ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/sociials-ui/tabs";
import { Undo, Redo, Info, Settings, Github } from "lucide-react";

export default function GithubSimulatorPage() {
  const {
    state,
    terminalLogs,
    commit,
    createBranch,
    checkout,
    merge,
    rebase,
    resolveConflict,
    reset,
    loadScenario,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useGitSimulation();

  const [workingFiles, setWorkingFiles] = useState<File[]>([]);
  const [mobileTab, setMobileTab] = useState<"controls" | "graph" | "files">("graph");

  // Sync working directory
  useEffect(() => {
    const headNode = state.nodes.find((n) => n.id === state.headId);
    if (headNode) {
      setWorkingFiles(headNode.files);
    }
  }, [state.headId, state.nodes]);

  const handleCommit = (msg: string) => {
    commit(msg, workingFiles);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-950 overflow-hidden font-sans">
      {/* Header */}
      <header className="h-14 border-b border-slate-800 bg-slate-900 flex items-center px-4 md:px-6 justify-between flex-shrink-0 z-20 relative">
        <div className="flex items-center gap-2 overflow-hidden">
          <Github className="text-white flex-shrink-0" size={24} />
          <h1 className="font-bold text-slate-100 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
            Git Simulator
          </h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/50 text-blue-400 border border-blue-800 hidden sm:inline-block">
            v2.1
          </span>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <div className="hidden md:block">
            <GitCheatSheet />
          </div>
          <div className="w-px h-6 bg-slate-800 mx-2 hidden md:block" />
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            disabled={!canUndo || !!state.conflict}
            className="text-slate-400 hover:text-slate-100 px-2"
          >
            <Undo size={16} className="md:mr-1" /> <span className="hidden md:inline">Undo</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={redo}
            disabled={!canRedo || !!state.conflict}
            className="text-slate-400 hover:text-slate-100 px-2"
          >
            <span className="hidden md:inline">Redo</span> <Redo size={16} className="md:ml-1" />
          </Button>
          <div className="w-px h-6 bg-slate-800 mx-1 md:mx-2" />
          <div className="md:hidden">
            <GitCheatSheet />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={reset}
            title="Reset"
            className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
          >
            <Settings size={18} />
          </Button>
        </div>
      </header>

      {/* Main Ide Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panel: Controls */}
        <aside
          className={`
            md:w-80 border-r border-slate-800 bg-slate-900/30 flex flex-col flex-shrink-0 overflow-y-auto z-10
            ${mobileTab === "controls" ? "w-full absolute inset-0 md:static z-30 bg-slate-950 md:bg-transparent" : "hidden md:flex"}
          `}
        >
          <div className="p-4 space-y-4 pb-20 md:pb-4">
            {/* Educational Message Banner */}
            {state.educationalMessage && (
              <div
                className={`p-3 border rounded-lg text-sm leading-relaxed shadow-sm transition-colors duration-500 ${state.conflict
                    ? "bg-red-950/20 border-red-900/40 text-red-200"
                    : "bg-blue-950/20 border-blue-900/40 text-blue-200/90"
                  }`}
              >
                <div
                  className={`flex items-center gap-2 mb-1 font-semibold text-xs uppercase tracking-wider ${state.conflict ? "text-red-400" : "text-blue-400"
                    }`}
                >
                  <Info size={12} />{" "}
                  {state.conflict ? "Action Required" : "Git Tip"}
                </div>
                {state.educationalMessage}
              </div>
            )}

            <Controls
              state={state}
              onCommit={handleCommit}
              onNewBranch={createBranch}
              onCheckout={checkout}
              onMerge={merge}
              onRebase={rebase}
              onReset={reset}
              onLoadScenario={loadScenario}
              disabled={!!state.conflict}
            />
          </div>
        </aside>

        {/* Center Panel: Graph Visualization & Log */}
        <main
          className={`
            flex-1 bg-slate-950 relative flex-col min-w-0 z-0
            ${mobileTab === "graph" ? "flex w-full absolute inset-0 md:static" : "hidden md:flex"}
          `}
        >
          {/* Graph Header overlay */}
          <div className="absolute top-4 left-4 z-20 bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-800 flex items-center gap-3 shadow-lg pointer-events-none">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-blue-500 box-shadow-glow"></span>
              {state.currentBranch}
            </div>
            <div className="w-px h-3 bg-slate-700"></div>
            <div className="text-xs font-mono text-slate-500">
              HEAD: {state.headId}
            </div>
          </div>

          {/* Top: Graph */}
          <div className="flex-1 overflow-hidden relative border-b border-slate-800">
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />
            <GitGraph state={state} />
          </div>

          {/* Bottom: Tabs for Log / Terminal */}
          <div className="h-64 flex-shrink-0 z-10 bg-slate-950 border-t border-slate-800 shadow-xl relative pb-16 md:pb-0">
            <Tabs
              defaultValue="log"
              className="h-full flex flex-col text-white"
            >
              <div className="px-4 border-b border-slate-800 bg-slate-900/50 flex flex-shrink-0">
                <TabsList className="bg-transparent h-9 p-0 gap-4">
                  <TabsTrigger
                    value="log"
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:shadow-none rounded-none h-full px-2 text-xs uppercase tracking-wide"
                  >
                    History Log
                  </TabsTrigger>
                  <TabsTrigger
                    value="terminal"
                    className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:shadow-none rounded-none h-full px-2 text-xs uppercase tracking-wide"
                  >
                    Terminal
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent
                value="log"
                className="flex-1 overflow-hidden m-0 data-[state=inactive]:hidden"
              >
                <GitLog state={state} />
              </TabsContent>

              <TabsContent
                value="terminal"
                className="flex-1 overflow-hidden m-0 data-[state=inactive]:hidden"
              >
                <GitTerminal logs={terminalLogs} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Conflict Overlay Modal */}
          {state.conflict && (
            <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-300">
              <ConflictResolver
                conflict={state.conflict}
                onResolve={resolveConflict}
              />
            </div>
          )}
        </main>

        {/* Right Panel: File Explorer */}
        <aside
          className={`
            md:w-96 border-l border-slate-800 bg-[#1e1e1e] flex-col flex-shrink-0 z-10
            ${mobileTab === "files" ? "flex w-full absolute inset-0 md:static z-30 pb-16 md:pb-0" : "hidden md:flex"}
            `}
        >
          <FileExplorer
            files={workingFiles}
            onFileChange={setWorkingFiles}
            disabled={!!state.conflict}
          />
        </aside>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden h-14 bg-slate-900 border-t border-slate-800 flex items-center justify-around z-40 relative flex-shrink-0">
        <button
          onClick={() => setMobileTab("controls")}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${mobileTab === "controls" ? "text-blue-400" : "text-slate-500"
            }`}
        >
          <Settings size={20} />
          <span className="text-[10px] uppercase font-bold tracking-wider">Controls</span>
        </button>
        <button
          onClick={() => setMobileTab("graph")}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${mobileTab === "graph" ? "text-blue-400" : "text-slate-500"
            }`}
        >
          <Github size={20} />
          <span className="text-[10px] uppercase font-bold tracking-wider">Graph</span>
        </button>
        <button
          onClick={() => setMobileTab("files")}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${mobileTab === "files" ? "text-blue-400" : "text-slate-500"
            }`}
        >
          <div className="relative">
            {/* Show dot if files are modified? Maybe later */}
            {/* <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full border border-slate-900" /> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-file-code"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider">Files</span>
        </button>
      </div>

    </div>
  );
}
