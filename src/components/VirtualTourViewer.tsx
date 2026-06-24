"use client";

import React, { useEffect, useRef } from 'react';

type SceneConfig = {
  id: string;
  title: string;
  description: string;
  imagePath: string;
};

const SCENE_CONFIGS: Record<string, SceneConfig> = {
  lionPark: {
    id: 'lionPark',
    title: 'Lion Park (Campus Landmark)',
    description: 'Experience the entrance and main meeting hub of the campus in a fully rotatable panoramic 360-degree projection.',
    imagePath: '/assets/projects-screenshots/vitb-360-tour/lion park.jpg',
  },
  lc3: {
    id: 'lc3',
    title: 'Learning Center (LC - Scene 3)',
    description: 'Explore the modern study spaces and architecture of the Learning Center.',
    imagePath: '/assets/projects-screenshots/vitb-360-tour/lc 3.jpg',
  },
  abFrontGate2: {
    id: 'abFrontGate2',
    title: 'Academic Block 1 (Front Gate)',
    description: 'Look around the front entrance gate of Academic Block 1.',
    imagePath: '/assets/projects-screenshots/vitb-360-tour/ab front gate 2.jpg',
  },
  ab2_8: {
    id: 'ab2_8',
    title: 'Academic Block 2 (Plaza View)',
    description: 'An immersive view of the open plaza area surrounding Academic Block 2.',
    imagePath: '/assets/projects-screenshots/vitb-360-tour/ab2  8.jpg',
  }
};

function SingleSceneViewer({ scene }: { scene: SceneConfig }) {
  const viewerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pannellumObj = (window as any).pannellum;
    if (!pannellumObj) return;

    // Clean up previous viewer instance if it exists
    if (viewerRef.current) {
      try {
        viewerRef.current.destroy();
        viewerRef.current = null;
      } catch (e) {}
    }

    // Initialize Pannellum
    if (containerRef.current) {
      viewerRef.current = pannellumObj.viewer(containerRef.current, {
        type: 'equirectangular',
        panorama: scene.imagePath,
        autoLoad: true,
        showControls: true,
        compass: false,
        hfov: 100,
        minHfov: 50,
        maxHfov: 120,
        pitch: 0,
        yaw: 0,
      });
    }

    return () => {
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
          viewerRef.current = null;
        } catch (e) {}
      }
    };
  }, [scene.imagePath]);

  return (
    <div className="tour-scene-block" style={{ marginBottom: '32px', borderBottom: '1px solid #2d3748', paddingBottom: '24px' }}>
      {/* Scene Header */}
      <div className="tour-header" style={{ marginBottom: '16px' }}>
        <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 6px 0', color: '#fff' }}>
          {scene.title}
        </h4>
        <p style={{ fontSize: '0.875rem', color: '#a0aec0', margin: '0', lineHeight: '1.5' }}>
          {scene.description}
        </p>
      </div>

      {/* Panorama Canvas Container */}
      <div 
        ref={containerRef} 
        style={{ 
          width: '100%', 
          height: '400px', 
          backgroundColor: '#000', 
          borderRadius: '8px', 
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid #2d3748'
        }}
      />
    </div>
  );
}

export default function VirtualTourViewer() {
  return (
    <div className="virtual-tour-container" style={{ fontFamily: 'inherit', padding: '10px 0' }}>
      {Object.values(SCENE_CONFIGS).map((scene) => (
        <SingleSceneViewer key={scene.id} scene={scene} />
      ))}
    </div>
  );
}
