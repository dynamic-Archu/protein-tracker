import React from 'react';
import { useMousePosition } from '../hooks/useMousePosition';

export function FloatingDecorations({ activeTab }) {
    const mouse = useMousePosition();
    const parallaxX = mouse.normalizedX * -40;
    const parallaxY = mouse.normalizedY * -25;

    const renderElements = () => {
        switch (activeTab) {
            case 'today':
                return (
                    <>
                        <img src="/floating/apple.png" alt="" className="floating-element animate-float-delayed" style={{ top: '25%', left: 'max(10px, calc(50% - 390px))', width: '90px', opacity: 0.5, transform: 'rotate(-15deg)', filter: 'blur(3px)' }} />
                        <img src="/floating/fire.png" alt="" className="floating-element animate-float" style={{ bottom: '20%', left: 'max(15px, calc(50% - 410px))', width: '80px', opacity: 0.6, transform: 'rotate(10deg)', filter: 'blur(2px)' }} />
                        <img src="/floating/shaker.png" alt="" className="floating-element animate-float-delayed" style={{ top: '45%', right: 'max(5px, calc(50% - 460px))', width: '130px', opacity: 0.85, transform: 'rotate(25deg)', filter: 'blur(1px)' }} />
                    </>
                );
            case 'history':
                return (
                    <>
                        <img src="/floating/target.png" alt="" className="floating-element animate-float" style={{ top: '35%', left: 'max(10px, calc(50% - 390px))', width: '100px', opacity: 0.8, filter: 'blur(1px)' }} />
                        <img src="/floating/tub.png" alt="" className="floating-element animate-float-delayed" style={{ bottom: '20%', left: 'max(20px, calc(50% - 410px))', width: '90px', opacity: 0.6, transform: 'rotate(15deg)', filter: 'blur(2px)' }} />
                        <img src="/floating/clock.png" alt="" className="floating-element animate-float" style={{ top: '30%', right: 'max(10px, calc(50% - 420px))', width: '100px', opacity: 0.7, transform: 'rotate(-15deg)', filter: 'blur(1px)' }} />
                    </>
                );
            case 'calendar':
                return (
                    <>
                        <img src="/floating/heart.png" alt="" className="floating-element animate-float" style={{ top: '30%', left: 'max(10px, calc(50% - 430px))', width: '95px', opacity: 0.8, transform: 'rotate(-10deg)', filter: 'blur(1px)' }} />
                        <img src="/floating/dumbbell.png" alt="" className="floating-element animate-float-delayed" style={{ bottom: '15%', left: 'max(15px, calc(50% - 400px))', width: '120px', opacity: 0.7, transform: 'rotate(-20deg)', filter: 'blur(2px)' }} />
                        <img src="/floating/calendar.png" alt="" className="floating-element animate-float" style={{ top: '50%', right: 'max(10px, calc(50% - 410px))', width: '100px', opacity: 0.6, transform: 'rotate(25deg)', filter: 'blur(1px)' }} />
                    </>
                );
            case 'charts':
                return (
                    <>
                        <img src="/floating/sneaker.png" alt="" className="floating-element animate-float" style={{ top: '40%', left: 'max(10px, calc(50% - 450px))', width: '110px', opacity: 0.8, transform: 'rotate(15deg)', filter: 'blur(1px)' }} />
                        <img src="/floating/ring.png" alt="" className="floating-element animate-float-delayed" style={{ bottom: '20%', left: 'max(15px, calc(50% - 400px))', width: '105px', opacity: 0.7, transform: 'rotate(20deg)', filter: 'blur(2px)' }} />
                        <img src="/floating/arrow.png" alt="" className="floating-element animate-float" style={{ top: '35%', right: 'max(5px, calc(50% - 410px))', width: '120px', opacity: 0.6, transform: 'rotate(-10deg)', filter: 'blur(2px)' }} />
                    </>
                );
            case 'profile':
                return (
                    <>
                        <img src="/floating/apple.png" alt="" className="floating-element animate-float-delayed" style={{ top: '25%', left: 'max(10px, calc(50% - 420px))', width: '85px', opacity: 0.6, transform: 'rotate(45deg)', filter: 'hue-rotate(120deg) blur(2px)' }} />
                        <img src="/floating/heart.png" alt="" className="floating-element animate-float" style={{ bottom: '25%', left: 'max(20px, calc(50% - 400px))', width: '110px', opacity: 0.5, transform: 'rotate(-30deg)', filter: 'hue-rotate(240deg) blur(1px)' }} />
                        <img src="/floating/target.png" alt="" className="floating-element animate-float" style={{ top: '40%', right: 'max(5px, calc(50% - 450px))', width: '95px', opacity: 0.7, transform: 'rotate(10deg)', filter: 'hue-rotate(180deg) blur(2px)' }} />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 0,
                overflow: 'hidden',
                transform: `translate(${parallaxX}px, ${parallaxY}px)`,
                transition: 'transform 0.1s ease-out'
            }}
        >
            {renderElements()}
        </div>
    );
}
