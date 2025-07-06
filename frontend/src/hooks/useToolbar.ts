// Re-export the store hook and types for easier imports
export {
  useToolbarStore,
  type Tool,
  type NodeType,
} from "../stores/toolbarStore";

// Example usage:
// import { useToolbarStore } from '../hooks/useToolbar';
//
// const MyComponent = () => {
//   const { activeTool, setActiveTool, selectedNodeType } = useToolbarStore();
//
//   return (
//     <div>
//       Current tool: {activeTool}
//       {activeTool === 'plus' && selectedNodeType && (
//         <p>Adding: {selectedNodeType}</p>
//       )}
//     </div>
//   );
// };
