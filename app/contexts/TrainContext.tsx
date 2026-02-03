"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface TrainClass {
  code: string;
  label: string;
}

interface Train {
  number: string;
  name: string;
  runsOn: string[];
  depTime: string;
  depStation: string;
  depDate: string;
  journeyDateISO: string;
  duration: string;
  arrTime: string;
  arrStation: string;
  arrDate: string;
  classes: TrainClass[];
}

interface TrainContextType {
  trainListData: Train[];
  setTrainListData: (data: Train[]) => void;
}

const TrainContext = createContext<TrainContextType | undefined>(undefined);

export const TrainProvider = ({ children }: { children: ReactNode }) => {
  const [trainListData, setTrainListData] = useState<Train[]>([]);
  return (
    <TrainContext.Provider value={{ trainListData, setTrainListData }}>
      {children}
    </TrainContext.Provider>
  );
};
export const useTrainContext = (): TrainContextType => {
  const context = useContext(TrainContext);
  if (!context) {
    throw new Error("useTrainContext must be used within a TrainProvider");
  }
  return context;
};
