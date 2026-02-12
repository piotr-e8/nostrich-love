/**
 * Snort Thread Tree Component
 * Nested reply tree visualization
 */

import React, { useMemo } from 'react';
import { NoteCard } from './NoteCard';
import type { MockNote, MockUser } from '../../../data/mock';

interface ThreadTreeProps {
  notes: MockNote[];
  rootNoteId: string;
  users: MockUser[];
  onViewProfile: (user: MockUser) => void;
  onReply: (noteId: string) => void;
}

interface TreeNode {
  note: MockNote;
  children: TreeNode[];
  depth: number;
}

export const ThreadTree: React.FC<ThreadTreeProps> = ({
  notes,
  rootNoteId,
  users,
  onViewProfile,
  onReply,
}) => {
  // Create user lookup map
  const userMap = useMemo(() => {
    const map = new Map<string, MockUser>();
    users.forEach(user => map.set(user.pubkey, user));
    return map;
  }, [users]);

  // Build tree structure from flat notes
  const buildTree = (): TreeNode[] => {
    const noteMap = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    // First pass: create nodes
    notes.forEach(note => {
      noteMap.set(note.id, {
        note,
        children: [],
        depth: 0,
      });
    });

    // Second pass: build relationships
    notes.forEach(note => {
      const node = noteMap.get(note.id)!;
      
      // Find parent from tags
      const eTag = note.tags.find(tag => tag[0] === 'e');
      if (eTag) {
        const parentId = eTag[1];
        const parent = noteMap.get(parentId);
        if (parent) {
          parent.children.push(node);
          node.depth = parent.depth + 1;
        } else if (parentId === rootNoteId) {
          // Direct reply to root
          roots.push(node);
          node.depth = 0;
        } else {
          // Orphaned reply, add to root
          roots.push(node);
          node.depth = 0;
        }
      } else {
        // No parent tag, it's a root level reply
        roots.push(node);
        node.depth = 0;
      }
    });

    // Sort by timestamp
    const sortByTime = (nodes: TreeNode[]) => {
      nodes.sort((a, b) => a.note.created_at - b.note.created_at);
      nodes.forEach(node => sortByTime(node.children));
    };
    sortByTime(roots);

    return roots;
  };

  const renderNode = (node: TreeNode, index: number, parentIndex?: number) => {
    const author = userMap.get(node.note.pubkey);
    if (!author) return null;

    const isNested = node.depth > 0;
    const showConnector = node.depth > 0 || index > 0;

    return (
      <div
        key={node.note.id}
        className={`${isNested ? 'snort-reply snort-reply-nested' : ''}`}
        style={{ marginLeft: isNested ? `${node.depth * 28}px` : 0 }}
      >
        {/* Thread connector line */}
        {showConnector && (
          <div 
            className="absolute left-0 top-0 w-6 h-6"
            style={{
              borderLeft: '2px solid var(--snort-border)',
              borderBottom: '2px solid var(--snort-border)',
              borderBottomLeftRadius: '8px',
              marginLeft: isNested ? '-28px' : '22px',
              marginTop: '22px',
            }}
          />
        )}

        <NoteCard
          note={node.note}
          author={author}
          onViewProfile={() => onViewProfile(author)}
          showReplyLine={node.children.length > 0}
          compact={node.depth > 1}
        />

        {/* Render children */}
        {node.children.length > 0 && (
          <div className="relative">
            {node.children.map((child, childIndex) => 
              renderNode(child, childIndex, index)
            )}
          </div>
        )}
      </div>
    );
  };

  const tree = buildTree();

  if (tree.length === 0) {
    return (
      <div className="snort-empty">
        <svg className="snort-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p>No replies yet</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {tree.map((node, index) => renderNode(node, index))}
    </div>
  );
};

export default ThreadTree;
