
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Wrap the App component with a div that has padding at the bottom
const AppWithBottomPadding = () => {
  return (
    <div className="content-area">
      <App />
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<AppWithBottomPadding />);
