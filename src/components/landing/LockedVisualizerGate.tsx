"use client";

import React from "react";
import { SortingVisualizer } from "@/components/visualizer/SortingVisualizer";
import { AlgorithmId } from "@/types/sorting";

interface LockedVisualizerGateProps {
  selectedAlgorithm?: AlgorithmId;
  onSelectAlgorithm?: (algoId: AlgorithmId) => void;
}

export function LockedVisualizerGate({
  selectedAlgorithm,
  onSelectAlgorithm,
}: LockedVisualizerGateProps = {}) {
  return (
    <div className="space-y-3">
      <SortingVisualizer
        selectedAlgorithm={selectedAlgorithm}
        onSelectAlgorithm={onSelectAlgorithm}
      />
    </div>
  );
}
