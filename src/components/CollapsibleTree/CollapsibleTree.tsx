import React, { useState } from "react";

const treeData = {
  name: "Root",
  children: [
    {
      name: "Child 1",
      children: [
        { name: "Grandchild 1" },
        { name: "Grandchild 2" }
      ]
    },
    {
      name: "Child 2",
      children: [
        { name: "Grandchild 3" },
        { name: "Grandchild 4" }
      ]
    },
    {
      name: "Child 3",
      children: Array.from({ length: 30 }, (_, i) => ({ name: `Grandchild ${i + 5}` }))
    }
  ]
};

interface TreeNodeProps {
  node: {
    name: string;
    children?: TreeNodeProps['node'][];
  };
}

const TreeNode: React.FC<TreeNodeProps> = ({ node }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div style={{ marginLeft: "20px", borderLeft: "1px solid black", paddingLeft: "10px" }}>
      <div onClick={() => setExpanded(!expanded)} style={{ cursor: "pointer" }}>
        {node.children ? (expanded ? "▼ " : "▶ ") : "• "}{node.name}
      </div>
      {expanded && node.children && (
        <div>
          {node.children.map((child, index) => (
            <TreeNode key={index} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

const CollapsibleTree = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <TreeNode node={treeData} />
    </div>
  );
};

export default CollapsibleTree;
