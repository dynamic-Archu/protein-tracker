import { useState, useEffect } from 'react';

export function useMousePosition() {
    const [mousePosition, setMousePosition] = useState({
        x: 0,
        y: 0,
        normalizedX: 0,
        normalizedY: 0
    });

    useEffect(() => {
        const updateMousePosition = (ev) => {
            const x = ev.clientX;
            const y = ev.clientY;

            // Normalize values from -1 to 1 based on screen size
            const normalizedX = (x / window.innerWidth) * 2 - 1;
            const normalizedY = (y / window.innerHeight) * 2 - 1;

            setMousePosition({ x, y, normalizedX, normalizedY });
        };

        window.addEventListener('mousemove', updateMousePosition);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
        };
    }, []);

    return mousePosition;
}
