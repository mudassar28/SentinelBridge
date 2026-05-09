import React from 'react';
import Header from '@/components/Header';
import SecurityTerminal from '@/components/SecurityTerminal';
import DirectivesPanel from '@/components/DirectivesPanel';
import StatusBar from '@/components/StatusBar';

const Index: React.FC = () => {
  return (
    <div className="flex h-screen flex-col bg-background">
      <Header />

      {/* Main content */}
      <main className="flex flex-1 overflow-hidden pt-14">
        <div className="mx-auto flex w-full max-w-7xl gap-4 p-4">
          {/* Terminal - Main area */}
          <div className="flex flex-1 flex-col min-w-0">
            <SecurityTerminal />
          </div>

          {/* Sidebar - Directives panel */}
          <div className="hidden w-72 shrink-0 lg:block">
            <DirectivesPanel />
          </div>
        </div>
      </main>

      <StatusBar />
    </div>
  );
};

export default Index;
