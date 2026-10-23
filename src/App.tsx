import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/routes';
import { AiConsultantWidget } from './features/ai-consultant';

export const App: React.FC = () => {
  return (
    <>
      <RouterProvider router={router} />
      <AiConsultantWidget />
    </>
  );
};

export default App;
