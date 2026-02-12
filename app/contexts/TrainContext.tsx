// app/contexts/TrainContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface TrainClass {
  code: string;
  label: string;
}

export interface Train {
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
  depStationCode?: string;
  arrStationCode?: string;
}

export type TrainSearchState = {
  fromQuery: string;
  toQuery: string;
  date: string; // ISO YYYY-MM-DD
  trainclass: string; // can be label or code or "all"
};

interface TrainContextType {
  trainListData: Train[];
  setTrainListData: (data: Train[]) => void;

  searchState: TrainSearchState;
  setSearchState: (data: TrainSearchState) => void;
}

const TrainContext = createContext<TrainContextType | undefined>(undefined);

export const TrainProvider = ({ children }: { children: ReactNode }) => {
  const [trainListData, setTrainListData] = useState<Train[]>([]);
  const [searchState, setSearchState] = useState<TrainSearchState>({
    fromQuery: "",
    toQuery: "",
    date: "",
    trainclass: "all",
  });

  return (
    <TrainContext.Provider
      value={{ trainListData, setTrainListData, searchState, setSearchState }}
    >
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
