
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface File {
    name: string;
    content: string;
}

export interface ConflictData {
    sourceBranch: string;
    targetBranch: string;
    files: {
        name: string;
        baseContent: string;
        targetContent: string;
        sourceContent: string;
    }[];
}

export interface Node {
    id: string;
    type: 'commit' | 'merge';
    message: string;
    parentId: string | null;
    secondaryParentId?: string; // For merge commits
    branch?: string;
    files: File[]; // State of files at this commit
    x?: number;
    y?: number;
}

export interface Branch {
    name: string;
    commitId: string;
    color: string;
}

export interface GitGraphState {
    nodes: Node[];
    branches: Branch[];
    currentBranch: string;
    headId: string;
    conflict: ConflictData | null;
    educationalMessage: string | null;
}

const COLORS = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // amber
    '#8b5cf6', // violet
    '#ec4899', // pink
];

const INITIAL_COMMIT_ID = 'init';
const INITIAL_FILES: File[] = [
    { name: 'README.md', content: '# Project Title\n\nInitial description.' },
    { name: 'main.ts', content: 'console.log("Hello World");' }
];

const INITIAL_STATE: GitGraphState = {
    nodes: [
        {
            id: INITIAL_COMMIT_ID,
            type: 'commit',
            message: 'Initial commit',
            parentId: null,
            branch: 'main',
            files: INITIAL_FILES
        },
    ],
    branches: [
        { name: 'main', commitId: INITIAL_COMMIT_ID, color: COLORS[0] },
    ],
    currentBranch: 'main',
    headId: INITIAL_COMMIT_ID,
    conflict: null,
    educationalMessage: "Welcome! Try committing changes or loading a scenario."
};

/**
 * Scenario Definitions
 */
const SCENARIOS = {
    'conflict-101': () => {
        const baseFiles = [{ name: 'story.txt', content: 'Once upon a time...' }];
        const initId = 'init-sc';
        const branchAId = 'feat-a';
        const branchBId = 'feat-b';

        const nodes: Node[] = [
            { id: initId, type: 'commit', message: 'Start story', parentId: null, branch: 'main', files: baseFiles },
            // Branch A
            { id: branchAId, type: 'commit', message: 'Add dragon', parentId: initId, branch: 'feature-dragon', files: [{ name: 'story.txt', content: 'Once upon a time, there was a DRAGON.' }] },
            // Branch B
            { id: branchBId, type: 'commit', message: 'Add knight', parentId: initId, branch: 'main', files: [{ name: 'story.txt', content: 'Once upon a time, there was a KNIGHT.' }] },
        ];

        return {
            nodes,
            branches: [
                { name: 'main', commitId: branchBId, color: COLORS[0] },
                { name: 'feature-dragon', commitId: branchAId, color: COLORS[1] },
            ],
            currentBranch: 'main',
            headId: branchBId,
            conflict: null,
            educationalMessage: "SCENARIO LOADED: Conflict 101. Try merging 'feature-dragon' into 'main'!"
        } as GitGraphState;
    },
    'diverged-branches': () => {
        // Main and Feature have both advanced from a common ancestor. 
        // Ideal for demonstrating Merge ("diamond") vs Rebase ("linear").
        const initId = 'init-div';
        const main1Id = 'main-1';
        const feat1Id = 'feat-1';
        const feat2Id = 'feat-2';

        const nodes: Node[] = [
            { id: initId, type: 'commit', message: 'Initial commit', parentId: null, branch: 'main', files: INITIAL_FILES },
            // Main advances
            { id: main1Id, type: 'commit', message: 'Update README', parentId: initId, branch: 'main', files: [{ name: 'README.md', content: '# Project Title\n\nUpdated description.' }, { name: 'main.ts', content: 'console.log("Hello World");' }] },
            // Feature advances (from init)
            { id: feat1Id, type: 'commit', message: 'Add func', parentId: initId, branch: 'feature', files: [{ name: 'README.md', content: '# Project Title\n\nInitial description.' }, { name: 'main.ts', content: 'console.log("Hello World");\nfunction test() {}' }] },
            { id: feat2Id, type: 'commit', message: 'Refactor func', parentId: feat1Id, branch: 'feature', files: [{ name: 'README.md', content: '# Project Title\n\nInitial description.' }, { name: 'main.ts', content: 'console.log("Hello World");\nfunction test() { return true; }' }] },
        ];

        return {
            nodes,
            branches: [
                { name: 'main', commitId: main1Id, color: COLORS[0] },
                { name: 'feature', commitId: feat2Id, color: COLORS[1] },
            ],
            currentBranch: 'feature',
            headId: feat2Id,
            conflict: null,
            educationalMessage: "SCENARIO LOADED: Diverged Branches. You are on 'feature'. Try 'Merge' (diamond) vs 'Rebase' (linear) onto 'main'!"
        } as GitGraphState;
    },
    'complex-history': () => {
        // TODO: Implement if needed, but diverged is usually enough.
        return SCENARIOS['diverged-branches']();
    }
};

function findLCA(nodes: Node[], commitA: string, commitB: string): Node | null {
    const ancestorsA = new Set<string>();
    let current: string | null = commitA;
    while (current) {
        ancestorsA.add(current);
        const node = nodes.find(n => n.id === current);
        current = node?.parentId || null;
    }
    current = commitB;
    while (current) {
        if (ancestorsA.has(current)) {
            return nodes.find(n => n.id === current) || null;
        }
        const node = nodes.find(n => n.id === current);
        current = node?.parentId || null;
    }
    return null;
}

function hasChanges(oldFiles: File[], newFiles: File[]): boolean {
    if (oldFiles.length !== newFiles.length) return true;
    for (const newFile of newFiles) {
        const oldFile = oldFiles.find(f => f.name === newFile.name);
        if (!oldFile) return true;
        if (oldFile.content.trim() !== newFile.content.trim()) return true;
    }
    const allNames = new Set([...oldFiles.map(f => f.name), ...newFiles.map(f => f.name)]);
    for (const name of Array.from(allNames)) {
        if (!oldFiles.find(f => f.name === name) || !newFiles.find(f => f.name === name)) return true;
    }
    return false;
}

export function useGitSimulation() {
    const [history, setHistory] = useState<GitGraphState[]>([INITIAL_STATE]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

    const currentState = history[currentIndex];

    const logCommand = useCallback((cmd: string) => {
        setTerminalLogs(prev => [...prev, cmd]);
    }, []);

    const updateState = useCallback((newState: GitGraphState) => {
        const newHistory = history.slice(0, currentIndex + 1);
        setHistory([...newHistory, newState]);
        setCurrentIndex(newHistory.length);
    }, [history, currentIndex]);

    const commit = useCallback((message: string, newFiles: File[]) => {
        if (currentState.conflict) {
            logCommand(`git commit -m "${message}" (Failed: Resolve conflicts first)`);
            return;
        }

        const parentId = currentState.branches.find(b => b.name === currentState.currentBranch)?.commitId || null;
        if (!parentId) return;

        const parentNode = currentState.nodes.find(n => n.id === parentId);

        // Empty Commit Check
        if (parentNode) {
            const filesChanged = hasChanges(parentNode.files, newFiles);
            if (!filesChanged) {
                logCommand(`git commit -m "${message}" (Failed: No changes)`);
                updateState({
                    ...currentState,
                    educationalMessage: "⚠️ No changes detected! Modify a file before committing."
                });
                return;
            }
        }

        const newCommitId = uuidv4().slice(0, 7);
        const newNode: Node = {
            id: newCommitId,
            type: 'commit',
            message,
            parentId,
            branch: currentState.currentBranch,
            files: newFiles
        };

        const newBranches = currentState.branches.map(b =>
            b.name === currentState.currentBranch ? { ...b, commitId: newCommitId } : b
        );

        logCommand(`git commit -m "${message}"`);
        updateState({
            ...currentState,
            nodes: [...currentState.nodes, newNode],
            branches: newBranches,
            headId: newCommitId,
            educationalMessage: `Committed "${message}" to ${currentState.currentBranch}.`
        });
    }, [currentState, updateState, logCommand]);

    const createBranch = useCallback((branchName: string, baseBranch?: string) => {
        if (currentState.conflict) return;
        if (currentState.branches.some(b => b.name === branchName)) {
            logCommand(`git checkout -b ${branchName} (Failed: Exists)`);
            return;
        }

        // Determine start commit: from baseBranch (if provided) or current HEAD
        let startCommitId = currentState.headId;
        if (baseBranch) {
            const baseBranchObj = currentState.branches.find(b => b.name === baseBranch);
            if (baseBranchObj) {
                startCommitId = baseBranchObj.commitId;
            }
        }

        const newBranch: Branch = {
            name: branchName,
            commitId: startCommitId,
            color: COLORS[currentState.branches.length % COLORS.length],
        };

        const command = baseBranch
            ? `git checkout -b ${branchName} ${baseBranch}`
            : `git checkout -b ${branchName}`;

        logCommand(command);

        updateState({
            ...currentState,
            branches: [...currentState.branches, newBranch],
            currentBranch: branchName,
            headId: startCommitId,
            educationalMessage: `Created branch '${branchName}' from '${baseBranch || currentState.currentBranch}'.`
        });
    }, [currentState, updateState, logCommand]);

    const checkout = useCallback((branchName: string) => {
        if (currentState.conflict) return;
        const branch = currentState.branches.find(b => b.name === branchName);
        if (!branch) {
            logCommand(`git checkout ${branchName} (Failed: Not found)`);
            return;
        }

        logCommand(`git checkout ${branchName}`);
        updateState({
            ...currentState,
            currentBranch: branchName,
            headId: branch.commitId,
            educationalMessage: `Checked out '${branchName}'.`
        });
    }, [currentState, updateState, logCommand]);

    const merge = useCallback((sourceBranchName: string) => {
        if (currentState.conflict) return;
        const targetBranchName = currentState.currentBranch;

        logCommand(`git merge ${sourceBranchName}`);

        if (sourceBranchName === targetBranchName) {
            return;
        }

        const sourceBranch = currentState.branches.find(b => b.name === sourceBranchName);
        const targetBranch = currentState.branches.find(b => b.name === targetBranchName);

        if (!sourceBranch || !targetBranch) return;

        const sourceHeadNode = currentState.nodes.find(n => n.id === sourceBranch.commitId);
        const targetHeadNode = currentState.nodes.find(n => n.id === targetBranch.commitId);

        if (!sourceHeadNode || !targetHeadNode) return;

        const lcaNode = findLCA(currentState.nodes, sourceBranch.commitId, targetBranch.commitId);
        const baseFiles = lcaNode ? lcaNode.files : INITIAL_FILES;

        // Conflict Detection
        const conflictingFiles: { name: string; baseContent: string; targetContent: string; sourceContent: string }[] = [];
        const allFileNames = Array.from(new Set([
            ...baseFiles.map(f => f.name),
            ...sourceHeadNode.files.map(f => f.name),
            ...targetHeadNode.files.map(f => f.name)
        ]));

        for (const fileName of allFileNames) {
            const base = baseFiles.find(f => f.name === fileName)?.content || '';
            const target = targetHeadNode.files.find(f => f.name === fileName)?.content || '';
            const source = sourceHeadNode.files.find(f => f.name === fileName)?.content || '';

            if (base !== target && base !== source && target !== source) {
                conflictingFiles.push({
                    name: fileName,
                    baseContent: base,
                    targetContent: target,
                    sourceContent: source
                });
            }
        }

        if (conflictingFiles.length > 0) {
            updateState({
                ...currentState,
                conflict: {
                    sourceBranch: sourceBranchName,
                    targetBranch: targetBranchName,
                    files: conflictingFiles
                },
                educationalMessage: `CONFLICT: Automatic merge failed; fix conflicts and then commit the result.`
            });
            return;
        }

        // Auto Merge
        const mergedFiles: File[] = allFileNames.map(fileName => {
            const base = baseFiles.find(f => f.name === fileName)?.content || '';
            const target = targetHeadNode.files.find(f => f.name === fileName)?.content || '';
            const source = sourceHeadNode.files.find(f => f.name === fileName)?.content || '';

            if (target !== base) return { name: fileName, content: target };
            if (source !== base) return { name: fileName, content: source };
            return { name: fileName, content: base };
        });

        const newCommitId = uuidv4().slice(0, 7);
        const newNode: Node = {
            id: newCommitId,
            type: 'commit',
            message: `Merge branch '${sourceBranchName}' into ${targetBranchName}`,
            parentId: targetBranch.commitId,
            secondaryParentId: sourceBranch.commitId,
            branch: targetBranchName,
            files: mergedFiles
        };

        const newBranches = currentState.branches.map(b =>
            b.name === targetBranchName ? { ...b, commitId: newCommitId } : b
        );

        updateState({
            ...currentState,
            nodes: [...currentState.nodes, newNode],
            branches: newBranches,
            headId: newCommitId,
            educationalMessage: `Successfully merged '${sourceBranchName}'.`
        });

    }, [currentState, updateState, logCommand]);

    // --- REBASE LOGIC ---
    const rebase = useCallback((targetBranchName: string) => {
        if (currentState.conflict) return;
        const currentBranchName = currentState.currentBranch;

        logCommand(`git rebase ${targetBranchName}`);

        if (currentBranchName === targetBranchName) return;

        const currentBranchObj = currentState.branches.find(b => b.name === currentBranchName);
        const targetBranchObj = currentState.branches.find(b => b.name === targetBranchName);

        if (!currentBranchObj || !targetBranchObj) return;

        // 1. Find LCA to identify unique commits
        const lcaNode = findLCA(currentState.nodes, currentBranchObj.commitId, targetBranchObj.commitId);
        if (!lcaNode) return;

        // 2. Collect unique commits from currentBranch (from HEAD down to LCA)
        const commitsToReplay: Node[] = [];
        let ptr: string | null = currentBranchObj.commitId;

        while (ptr && ptr !== lcaNode.id) {
            const node = currentState.nodes.find(n => n.id === ptr);
            if (node) {
                commitsToReplay.unshift(node); // Add to front to preserve chronological order
                ptr = node.parentId;
            } else {
                break;
            }
        }

        // 3. Replay commits on top of targetBranch head
        let newParentId = targetBranchObj.commitId;
        const newNodes: Node[] = [];

        // We assume for simplicity that rebase doesn't cause conflict (in this sim)
        // or effectively "ours" wins for simplicity, OR we should detect conflicts.
        // For EDUCATION: Let's assume auto-merge/overwrite for now to show the GRAPH shape.

        let success = true;

        // We need to carry over the changes from each commit.
        // A commit is a snapshot. Ideally we diff (commit vs parent) and apply patch.
        // Simplified: We take the files from the commit. 
        // BUT, we need to respect updates in the Target (base).
        // Merging Node Files (from commit) with NewParent Files (from target).
        // Since we don't have diffs, this is tricky.
        // HEURISTIC: content = target.content + (commit.content - commitParent.content)
        // Too complex for this simple snapshot model.
        // SIMPLE MODEL: Just take the commit's files.
        // LIMITATION: Updates in 'target' will be lost if not present in 'commit'.
        // This is a known limitation of snapshot-based sim without diffs.
        // Improvement: Smart Merge with Target.

        // Let's do a smart-ish merge for each commit replay.
        const targetHeadNode = currentState.nodes.find(n => n.id === targetBranchObj.commitId);
        let currentBaseFiles = targetHeadNode ? targetHeadNode.files : INITIAL_FILES;

        for (const commitNode of commitsToReplay) {
            // "Patch" logic: What changed in this commit relative to ITS parent?
            // Since we don't have diffs, we just see if file content != LCA content?
            // Actually, we can compare commitNode.files vs lcaNode.files?
            // No, compare vs its own parent.
            const originalParent = currentState.nodes.find(n => n.id === commitNode.parentId);
            const originalParentFiles = originalParent ? originalParent.files : INITIAL_FILES;

            const replayedFiles: File[] = [];
            const allFileNames = Array.from(new Set([
                ...currentBaseFiles.map(f => f.name),
                ...commitNode.files.map(f => f.name)
            ]));

            for (const fileName of allFileNames) {
                const baseVal = currentBaseFiles.find(f => f.name === fileName)?.content;
                const commitVal = commitNode.files.find(f => f.name === fileName)?.content;
                const originalParentVal = originalParentFiles.find(f => f.name === fileName)?.content;

                // If changed in commit, take commit. Else take base (target).
                // Logic: If commitVal != originalParentVal, it was changed in this commit. Use it.
                // Else, keep the new base value (which might have been updated in target).

                if (commitVal !== originalParentVal && commitVal !== undefined) {
                    replayedFiles.push({ name: fileName, content: commitVal });
                } else if (baseVal !== undefined) {
                    replayedFiles.push({ name: fileName, content: baseVal });
                }
            }

            // Create new node
            const newCommitId = uuidv4().slice(0, 7);
            const newNode: Node = {
                id: newCommitId,
                type: 'commit',
                message: commitNode.message, // Preserve message
                parentId: newParentId,
                branch: currentBranchName,
                files: replayedFiles,
            };

            newNodes.push(newNode);
            newParentId = newCommitId;
            currentBaseFiles = replayedFiles; // Update base for next replay
        }

        // 4. Update State
        // Add new nodes. Update branch pointer.
        // Old nodes remain but might become orphaned if no branch points to them?
        // Actually, if we just update the branch pointer, they will be visually 'detached' or just inactive.

        const updatedBranches = currentState.branches.map(b =>
            b.name === currentBranchName ? { ...b, commitId: newParentId } : b
        );

        updateState({
            ...currentState,
            nodes: [...currentState.nodes, ...newNodes],
            branches: updatedBranches,
            headId: newParentId,
            educationalMessage: `Successfully rebased '${currentBranchName}' onto '${targetBranchName}'. History rewritten!`
        });

    }, [currentState, updateState, logCommand]);


    const resolveConflict = useCallback((resolvedFiles: File[]) => {
        if (!currentState.conflict) return;

        const { sourceBranch, targetBranch } = currentState.conflict;
        const targetBranchObj = currentState.branches.find(b => b.name === targetBranch);
        const sourceBranchObj = currentState.branches.find(b => b.name === sourceBranch);

        if (!targetBranchObj) return;

        logCommand(`git add . && git commit -m "Merge resolved"`);

        const newCommitId = uuidv4().slice(0, 7);
        const newNode: Node = {
            id: newCommitId,
            type: 'commit',
            message: `Merge branch '${sourceBranch}' into ${targetBranch} (Resolved)`,
            parentId: targetBranchObj.commitId,
            secondaryParentId: sourceBranchObj?.commitId,
            branch: targetBranch,
            files: resolvedFiles
        };

        const newBranches = currentState.branches.map(b =>
            b.name === targetBranch ? { ...b, commitId: newCommitId } : b
        );

        updateState({
            ...currentState,
            nodes: [...currentState.nodes, newNode],
            branches: newBranches,
            headId: newCommitId,
            conflict: null,
            educationalMessage: `Conflicts resolved.`
        });
    }, [currentState, updateState, logCommand]);

    const reset = useCallback(() => {
        logCommand(`git reset --hard initial`);
        setHistory([INITIAL_STATE]);
        setCurrentIndex(0);
    }, [logCommand]);

    const loadScenario = useCallback((scenarioKey: keyof typeof SCENARIOS) => {
        if (SCENARIOS[scenarioKey]) {
            logCommand(`## Loading Scenario: ${scenarioKey}...`);
            const scenarioState = SCENARIOS[scenarioKey]();
            setHistory([scenarioState]);
            setCurrentIndex(0);
        }
    }, [logCommand]);

    const undo = useCallback(() => {
        if (currentIndex > 0) {
            logCommand(`(undoing last action)`);
            setCurrentIndex(currentIndex - 1);
        }
    }, [currentIndex, logCommand]);

    const redo = useCallback(() => {
        if (currentIndex < history.length - 1) {
            const nextState = history[currentIndex + 1];
            logCommand(`(redoing action)`);
            setCurrentIndex(currentIndex + 1);
        }
    }, [currentIndex, history, logCommand]);

    return {
        state: currentState,
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
        canUndo: currentIndex > 0,
        canRedo: currentIndex < history.length - 1
    };
}
