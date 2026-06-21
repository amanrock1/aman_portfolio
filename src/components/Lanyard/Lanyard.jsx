/* eslint-disable react/no-unknown-property */
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

const cardGLB = '/assets/lanyard/card.glb';
const lanyardTexture = '/assets/lanyard/lanyard.png';
const collegeLogo = '/assets/lanyard/college-logo.png';
const profilePhoto = '/assets/lanyard/profile-photo.png';

import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  collegeName = 'VIT Bhopal University',
  studentName = 'AMAN KUMAR',
  semester = '6th Semester',
  gpa = '8.4 CGPA',
  skills = ['React', 'Python', 'C++', 'AI Tools'],
  projects = ['VoxTube', 'VR Campus Tour', 'Argicycle', 'SquadUp', 'Portfolio Website']
}) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent, antialias: true }}
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
        }
      >
        <ambientLight intensity={Math.PI * 0.6} />
        <directionalLight position={[5, 5, 5]} intensity={2.5} />
        <pointLight position={[-4, 3, 3]} intensity={6} color="#c8b8ff" />

        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band
            isMobile={isMobile}
            collegeName={collegeName}
            studentName={studentName}
            semester={semester}
            gpa={gpa}
            skills={skills}
            projects={projects}
          />
        </Physics>

        <Environment blur={0.75}>
          <Lightformer intensity={4}  color="#ffffff" position={[0, -1, 5]}   rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={5}  color="#ddd6fe" position={[-1, -1, 1]}  rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={5}  color="#ffffff" position={[1, 1, 1]}    rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={18} color="#ffffff" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
          <Lightformer intensity={8}  color="#38bdf8" position={[10, 5, 2]}   rotation={[0, -Math.PI / 2, 0]} scale={[50, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  collegeName,
  studentName,
  semester,
  gpa,
  skills = [],
  projects = []
}) {
  const band = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4
  };

  const { nodes, materials } = useGLTF(cardGLB);

  const originalLanyardTexture = useTexture(lanyardTexture);
  const collegeLogoTexture = useTexture(collegeLogo);
  const profilePhotoTexture = useTexture(profilePhoto);

  const cardTexture = useMemo(() => {
    return createCardTexture({
      collegeName,
      studentName,
      semester,
      gpa,
      skills,
      projects,
      collegeLogoImage: collegeLogoTexture.image,
      profileImage: profilePhotoTexture.image
    });
  }, [
    collegeName,
    studentName,
    semester,
    gpa,
    skills,
    projects,
    collegeLogoTexture.image,
    profilePhotoTexture.image
  ]);

  const strapTexture = useMemo(() => {
    return createStrapTexture({
      baseImage: originalLanyardTexture.image,
      logoImage: collegeLogoTexture.image,
      text: 'AMAN'
    });
  }, [originalLanyardTexture.image, collegeLogoTexture.image]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3()
      ])
  );

  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [
    [0, 0, 0],
    [0, 0, 0],
    1
  ]);

  useRopeJoint(j1, j2, [
    [0, 0, 0],
    [0, 0, 0],
    1
  ]);

  useRopeJoint(j2, j3, [
    [0, 0, 0],
    [0, 0, 0],
    1
  ]);

  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';

      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));

      [card, j1, j2, j3, fixed].forEach((ref) => {
        ref.current?.wakeUp();
      });

      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });
    }

    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) {
          ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        }

        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
        );

        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });

      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());

      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());

      card.current.setAngvel({
        x: ang.x,
        y: ang.y - rot.y * 0.25,
        z: ang.z
      });
    }
  });

  curve.curveType = 'chordal';

  strapTexture.wrapS = THREE.RepeatWrapping;
  strapTexture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />

        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />

          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e) => {
              e.target.setPointerCapture(e.pointerId);
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current.translation()))
              );
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardTexture}
                map-anisotropy={16}
                clearcoat={isMobile ? 0.4 : 1.0}
                clearcoatRoughness={0.05}
                roughness={0.18}
                metalness={0.08}
                reflectivity={0.9}
                envMapIntensity={1.8}
                side={THREE.DoubleSide}
              />
            </mesh>

            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />

            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={strapTexture}
          repeat={[-6, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}

function createCardTexture({
  collegeName,
  studentName,
  semester,
  gpa,
  skills,
  projects,
  collegeLogoImage,
  profileImage
}) {
  const canvas = document.createElement('canvas');
  canvas.width = 2000;
  canvas.height = 2000;

  const ctx = canvas.getContext('2d');

  // Safety guards
  const safeSkills = Array.isArray(skills) ? skills : [];
  const safeProjects = Array.isArray(projects) ? projects : [];
  // Dark premium gradient background
  const bgGrad = ctx.createLinearGradient(0, 0, canvas.width / 2, canvas.height);
  bgGrad.addColorStop(0,   '#020617');
  bgGrad.addColorStop(0.5, '#070a13');
  bgGrad.addColorStop(1,   '#0b0f19');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Diagonal gloss sweep
  const gloss = ctx.createLinearGradient(0, 0, canvas.width / 2, canvas.height / 2);
  gloss.addColorStop(0,    'rgba(255,255,255,0.06)');
  gloss.addColorStop(0.38, 'rgba(255,255,255,0.13)');
  gloss.addColorStop(0.39, 'rgba(255,255,255,0.0)');
  gloss.addColorStop(1,    'rgba(255,255,255,0.0)');
  ctx.fillStyle = gloss;
  ctx.fillRect(0, 0, canvas.width / 2, canvas.height);

  // Subtle cyan/sky-blue accent glow bottom-left
  const glow = ctx.createRadialGradient(100, canvas.height - 100, 0, 100, canvas.height - 100, 500);
  glow.addColorStop(0,   'rgba(56,189,248,0.22)');
  glow.addColorStop(1,   'rgba(56,189,248,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width / 2, canvas.height);

  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 3;

  const padding = 55;
  const gap = 32;

  // We draw everything on the left half (0 to 1000) for the front of the card.
  // The right half (1000 to 2000) is the back of the card.
  
  const frontXOffset = 0;

  // Calculate layout widths for the front
  const leftColW = 450;
  const rightColW = 408;

  const box1 = { x: frontXOffset + padding, y: padding, w: leftColW, h: 250 };
  const box3 = { x: frontXOffset + padding, y: padding + box1.h + gap, w: leftColW, h: 300 };
  const box2 = { x: frontXOffset + padding + leftColW + gap, y: padding, w: rightColW, h: box1.h + box3.h + gap };
  const box4 = { x: frontXOffset + padding, y: padding + box2.h + gap, w: leftColW + rightColW + gap, h: 600 };

  drawBox(ctx, box1);
  drawBox(ctx, box2);
  drawBox(ctx, box3);
  drawBox(ctx, box4);

  // Box 1: College
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 46px Arial';
  ctx.fillText('COLLEGE', box1.x + 30, box1.y + 62);

  ctx.font = '800 40px Arial';
  wrapText(ctx, collegeName, box1.x + 30, box1.y + 130, box1.w - 150, 48);

  if (collegeLogoImage) {
    // Draw a subtle border circle behind logo
    ctx.beginPath();
    ctx.arc(box1.x + box1.w - 75, box1.y + 125, 60, 0, 2 * Math.PI);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#111111';
    ctx.stroke();
    drawImageContain(
      ctx,
      collegeLogoImage,
      box1.x + box1.w - 125,
      box1.y + 75,
      100,
      100
    );
  }

  // Box 2: Profile photo
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 46px Arial';
  ctx.fillText(studentName.split(' ')[0], box2.x + 30, box2.y + 65);

  if (profileImage) {
    drawImageCover(ctx, profileImage, box2.x + 35, box2.y + 105, box2.w - 70, 405);
  } else {
    // Placeholder if no photo
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(box2.x + 35, box2.y + 105, box2.w - 70, 405);
  }

  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '800 30px Arial';
  ctx.fillText('Portfolio ID Card', box2.x + 35, box2.y + box2.h - 40);

  // Box 3: GPA and semester
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 46px Arial';
  ctx.fillText('ACADEMICS', box3.x + 30, box3.y + 65);

  ctx.font = '800 64px Arial';
  ctx.fillText(gpa, box3.x + 30, box3.y + 175);

  ctx.font = '800 44px Arial';
  ctx.fillText(semester, box3.x + 30, box3.y + 250);

  // Box 4: Skills and projects
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 48px Arial';
  ctx.fillText('SKILLS & PROJECTS', box4.x + 40, box4.y + 75);

  ctx.font = '800 38px Arial';
  ctx.fillText('Skills', box4.x + 40, box4.y + 150);

  ctx.font = '800 34px Arial';
  let skillY = box4.y + 215;

  safeSkills.forEach((skill) => {
    ctx.fillText(`• ${skill}`, box4.x + 50, skillY);
    skillY += 48;
  });

  ctx.font = '800 38px Arial';
  ctx.fillText('Projects', box4.x + 460, box4.y + 150);

  ctx.font = '800 34px Arial';
  let projectY = box4.y + 215;

  safeProjects.forEach((project) => {
    wrapText(ctx, `• ${project}`, box4.x + 470, projectY, 390, 44);
    projectY += 80;
  });

  // Footer text
  ctx.font = '800 38px Arial';
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.fillText(`${studentName}  •  DEVELOPER PORTFOLIO`, box4.x, 1360);

  // --- DRAW BACK OF THE CARD ---
  // A simple design for the back of the card on the right half of the canvas
  const backXOffset = 1000;
  
  const backGrad = ctx.createLinearGradient(backXOffset, 0, backXOffset + 1000, canvas.height);
  backGrad.addColorStop(0, '#0f0f1a');
  backGrad.addColorStop(1, '#1a1030');
  ctx.fillStyle = backGrad;
  ctx.fillRect(backXOffset + padding, padding, 1000 - padding * 2, 1400 - padding * 2);

  // Back gloss
  const backGloss = ctx.createLinearGradient(backXOffset, 0, backXOffset + 500, 700);
  backGloss.addColorStop(0,    'rgba(255,255,255,0.08)');
  backGloss.addColorStop(0.4,  'rgba(255,255,255,0.0)');
  ctx.fillStyle = backGloss;
  ctx.fillRect(backXOffset + padding, padding, 1000 - padding * 2, 1400 - padding * 2);
  
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 60px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('DEVELOPER PORTFOLIO', backXOffset + 500, 700);
  
  if (collegeLogoImage) {
    ctx.globalAlpha = 0.2;
    drawImageContain(ctx, collegeLogoImage, backXOffset + 250, 400, 500, 500);
    ctx.globalAlpha = 1.0;
  }
  
  // Reset text align
  ctx.textAlign = 'left';

  const texture = new THREE.CanvasTexture(canvas);

  // If card appears upside down in your model, change this to true.
  texture.flipY = false;

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function createStrapTexture({ baseImage, logoImage, text }) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;

  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (baseImage) {
    ctx.globalAlpha = 0.35;
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
  }

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 34px Arial';
  ctx.fillText(text, 165, 78);

  if (logoImage) {
    drawImageContain(ctx, logoImage, 60, 34, 58, 58);
    drawImageContain(ctx, logoImage, 390, 34, 58, 58);
  } else {
    ctx.font = '700 48px Arial';
    ctx.fillText('*', 72, 82);
    ctx.fillText('*', 402, 82);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function drawBox(ctx, box) {
  // Glassmorphism box
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath();
  ctx.roundRect(box.x, box.y, box.w, box.h, 16);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255,255,255,0.20)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(box.x, box.y, box.w, box.h, 16);
  ctx.stroke();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = String(text).split(' ');
  let line = '';

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth && i > 0) {
      ctx.fillText(line, x, y);
      line = words[i] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  ctx.fillText(line, x, y);
}

function drawImageContain(ctx, image, x, y, w, h) {
  if (!image) return;

  const imageRatio = image.width / image.height;
  const boxRatio = w / h;

  let drawWidth = w;
  let drawHeight = h;

  if (imageRatio > boxRatio) {
    drawHeight = w / imageRatio;
  } else {
    drawWidth = h * imageRatio;
  }

  const dx = x + (w - drawWidth) / 2;
  const dy = y + (h - drawHeight) / 2;

  ctx.drawImage(image, dx, dy, drawWidth, drawHeight);
}

function drawImageCover(ctx, image, x, y, w, h) {
  if (!image) return;

  const imageRatio = image.width / image.height;
  const boxRatio = w / h;

  let sourceX = 0;
  let sourceY = 0;
  let sourceWidth = image.width;
  let sourceHeight = image.height;

  if (imageRatio > boxRatio) {
    sourceWidth = image.height * boxRatio;
    sourceX = (image.width - sourceWidth) / 2;
  } else {
    sourceHeight = image.width / boxRatio;
    sourceY = (image.height - sourceHeight) / 2;
  }

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    x,
    y,
    w,
    h
  );
}

useGLTF.preload(cardGLB);
