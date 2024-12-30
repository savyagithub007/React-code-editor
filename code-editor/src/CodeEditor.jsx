import React, { useState, useRef, useEffect } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import gsap from 'gsap';

const CodeEditor = () => {
  const [code, setCode] = useState('// Write your code here...');
  const [isEditing, setIsEditing] = useState(true);
  const canvasRef = useRef(null);
  const editorRef = useRef(null);
  const buttonsRef = useRef(null);

  // Handle code change in the editor
  const handleChange = (e) => {
    setCode(e.target.value);
  };

  // Toggle between edit and view mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);

    // GSAP animation for toggling between edit and view mode
    gsap.fromTo(
      editorRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }
    );
    gsap.fromTo(
      buttonsRef.current,
      { y: -20 },
      { y: 0, duration: 0.5, ease: 'bounce.out' }
    );
  };

  // Handle save action
  const handleSave = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'code.txt';
    link.click();
  };

  // Canvas Animation (simple particle effect)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let particles = [];

    const createParticle = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: Math.random() * 3 - 1.5,
        speedY: Math.random() * 3 - 1.5,
      });
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Remove particle if it goes off-screen
        if (particle.x < 0 || particle.x > canvas.width || particle.y < 0 || particle.y > canvas.height) {
          particles.splice(index, 1);
        }
      });

      requestAnimationFrame(animateParticles);
    };

    for (let i = 0; i < 100; i++) {
      createParticle();
    }

    animateParticles();

  }, []);

  return (
    <div className="relative container mx-auto p-6">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-4" ref={buttonsRef}>
          <h1 className="text-2xl font-bold">Code Editor</h1>
          <div>
            <button
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-md transition-transform transform hover:scale-105 hover:from-blue-400 hover:to-purple-500 duration-300 ease-in-out mr-2"
              onClick={toggleEdit}
            >
              {isEditing ? 'View' : 'Edit'}
            </button>
            <button
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2 rounded-md transition-transform transform hover:scale-105 hover:from-green-400 hover:to-teal-400 duration-300 ease-in-out"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg" ref={editorRef}>
          {isEditing ? (
            <textarea
              value={code}
              onChange={handleChange}
              className="w-full h-80 bg-gray-800 text-white p-4 rounded-lg font-mono"
              spellCheck="false"
            />
          ) : (
            <SyntaxHighlighter language="javascript" style={docco}>
              {code}
            </SyntaxHighlighter>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
